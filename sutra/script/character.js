/**
 * 座標概念を使用するためのクラス
 */
class Position {
  /**
   *
   *
   *
   */
  constructor(x, y) {
    /**
     *
     *
     */
    this.x = x;
    /**
     *
     *
     */
    this.y = y;
  }

  /**
   * 座標を再設定する
   *
   *
   */
  set(x, y) {
    if (x != null) {
      this.x = x;
    }
    if (y != null) {
      this.y = y;
    }
  }
}

/**
 * 画面上のオブジェクト（キャラクター）を使うためのクラス、このクラスがベースとなる
 */
class Character {
  /**
   *
   *
   *
   *
   *
   * imageはオブジェクトの画像
   */
  constructor(ctx, x, y, w, h, life, image) {
    /**
     *
     */
    this.ctx = ctx;
    /**
     * 画面上のオブジェクトの存在する座標
     */
    this.position = new Position(x, y);
    /**
     *
     */
    this.width = w;
    /**
     *
     *
     */
    this.height = h;
    /**
     *
     *
     */
    this.life = life;
    /**
     *
     */
    this.image = image;
  }

  /**
   * オブジェクトを画面に描画する
   */
  draw() {
    // offset
    let offsetX = this.width / 2;
    let offsetY = this.height / 2;
    this.ctx.drawImage(
      this.image,
      this.position.x - offsetX,
      this.position.y - offsetY,
      this.width,
      this.height
    );
  }
}

/**
 * 自分機クラス viperはシューティングゲームの主人公としての山田太郎的な名前である
 */
class Viper extends Character {
  /**
   *
   *
   *
   *
   *
   *
   *
   */
  constructor(ctx, x, y, w, h, image) {
    //
    // インスタンス化したときには、ライフは画面に描画されないためのフラグとして,0を与える
    super(ctx, x, y, w, h, 0, image);

    /**
     * viperが更新されるたびに移動する量(スピードという概念と論理的には等価)
     *
     */
    this.speed = 3;
    /**
     *
     *
     */
    this.isComing = false;
    /**
     *
     * 登場開始シーンが始まったときのタイムスタンプ
     */
    this.comingStart = null;
    /**
     * 登場シーンを開始する座標
     *
     */
    this.comingStartPosition = null;
    /**
     *
     * 登場シーンが終わるときにviperの座標
     */
    this.comingEndPosition = null;
  }

  /**
   * 登場シーンに関する設定を行う
   *
   *
   *
   *
   */
  setComing(startX, startY, endX, endY) {
    //
    this.isComing = true;
    //
    this.comingStart = Date.now();
    //
    this.position.set(startX, startY);
    //
    this.comingStartPosition = new Position(startX, startY);
    //
    this.comingEndPosition = new Position(endX, endY);
  }

  /**
   * 画面オブジェクトを更新したのちに描画する
   */
  update() {
    // 今の時点でのタイムスタンプを取得
    let justTime = Date.now();

    // 登場シーンであるか、そうでないかで更新処理を分岐させる
    if (this.isComing === true) {
      // 登場シーンがスタートしてからの経過時間
      let comingTime = (justTime - this.comingStart) / 1000;
      //
      let y = this.comingStartPosition.y - comingTime * 50;
      //
      if (y <= this.comingEndPosition.y) {
        this.isComing = false;
        // 行き過ぎる可能性があるので補正する
        y = this.comingEndPosition.y;
      }
      // viperの上昇を実現するために、計算したy座標を設定する
      this.position.set(this.position.x, y);

      if (justTime % 4 === 0) {
        this.ctx.globalAlpha = 0.5; //半透明にして、点滅を表現する
      }
    } else {
      // キーが押された状態に応じて座標を変更する
      if (window.isKeyDown.key_ArrowLeft === true) {
        this.position.x -= this.speed;
      }
      if (window.isKeyDown.key_ArrowRight === true) {
        this.position.x += this.speed;
      }
      if (window.isKeyDown.key_ArrowUp === true) {
        this.position.y -= this.speed;
      }
      if (window.isKeyDown.key_ArrowDown === true) {
        this.position.y += this.speed;
      }
      // 移動後の位置が画面がでてしまっていたら場合には、画面端で泊まるようにする
      let canvasWidth = this.ctx.canvas.width;
      let canvasHeight = this.ctx.canvas.height;
      // x座標が0より大きくcanvasWidthより小さければいいので
      let tx = Math.min(Math.max(this.position.x, 0), canvasWidth);
      let ty = Math.min(Math.max(this.position.y, 0), canvasHeight);
      // 目的を実現するための計算処理で求めた座標をセットする
      this.position.set(tx, ty);
    }
    // 計算した、y座標、点滅の適用のもとで、viperを画面に描画する
    this.draw();

    // 念のためににグローバルアルファを戻しておく
    this.ctx.globalAlpha = 1.0;
  }
}
