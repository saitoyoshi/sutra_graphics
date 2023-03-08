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
   * @param {string}}imagePath 画面オブジェクト（キャラクター）の画像のパス
   */
  constructor(ctx, x, y, w, h, life, imagePath) {
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
    this.ready = false;
    /**
     *
     */
    this.image = new Image();
    this.image.addEventListener(
      'load',
      () => {
        // 画像が適切に読み込まれたら、画像の準備が完了したという状態をもたせる
        this.ready = true;
      },
      false,
    );
    this.image.src = imagePath;
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
  constructor(ctx, x, y, w, h, imagePath) {
    //
    // インスタンス化したときには、ライフは画面に描画されないためのフラグとして,0を与える
    super(ctx, x, y, w, h, 0, imagePath);

    /**
     * viperが更新されるたびに移動する量(スピードという概念と論理的には等価)
     *
     */
    this.speed = 3;
    /**
     *
     * ショットを打ったあとのチェックをするためのカウンタ
     */
    this.shotCheckCounter = 0;
    /**
     * ショットを打つことができる間隔。フレーム数
     *
     */
    this.shotInterval = 10;
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
    /**
     *
     *
     */
    this.shotArray = null;
    /**
     *
     *
     */
    this.singleShotArray = null;
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
   * viperがショットを打てるように設定する
   */
  setShotArray(shotArray, singleShotArray) {
    this.shotArray = shotArray;
    this.singleShotArray = singleShotArray;
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

      // キーが押されていれば、ショットを発射する(生成する)
      if (window.isKeyDown.key_z === true) {
        // ショットが打てる状態なのかどうか確認する
        // ショットチェック用のカウンターが0以上であれば、ショットを生成する
        if (this.shotCheckCounter >= 0) {
          // 死んでる（画面に描画されていない）ショットがあれば、ショットを生成する
          let i;
          for (i = 0; i < this.shotArray.length; i++) {
            // 死んでるか確認する
            if (this.shotArray[i].life <= 0) {
              // viperのいる座標（場所）にショットを生成する
              this.shotArray[i].set(this.position.x, this.position.y);
              // ショットを生成したので、次のショットを打てるまでの間隔を設定する
              this.shotCheckCounter =  -this.shotInterval;
              // ひとつ作ったらループを抜ける
              break;
            }
          }
          // シングルショットが死んでいるものがあれば、生成する
          // このとき、2個ワンセットで生成して、左右に進行方向を分岐させる
          for (i = 0; i < this.singleShotArray.length; i++) {
            if (this.singleShotArray[i].life <= 0 && this.singleShotArray[i + 1].life <= 0) {
              // viperのいる座標にショットを生成
              this.singleShotArray[i].set(this.position.x, this.position.y);
              this.singleShotArray[i].setVector(0.2, -0.9);
              this.singleShotArray[i + 1].set(this.position.x, this.position.y);
              this.singleShotArray[i + 1].setVector(-0.2, -0.9);
              // ショットをつくったので、次のショットが作れるまでの間隔をつくる
              this.shotCheckCounter = -this.shotInterval;
              // 一組生成したら、ループを抜ける
              break;
            }
          }
        }
      }
      this.shotCheckCounter++;
    }
    // 計算した、y座標、点滅の適用のもとで、viperを画面に描画する
    this.draw();

    // 念のためににグローバルアルファを戻しておく
    this.ctx.globalAlpha = 1.0;
  }
}

/**
 *
 */
class Shot extends Character {
  /**
   *
   *
   *
   *
   */
  constructor(ctx, x, y, w, h, imagePath) {
    super(ctx, x, y, w, h, 0, imagePath);

    /**
     * ショットの更新のたびに進む移動量（移動スピード）
     */
    this.speed = 7;
    /**
     *
     *
     */
    this.vector = new Position(0.0, -1.0);
  }

  /**
   * ショットをキャンバス上に配置する
   */
  set(x, y) {
    this.position.set(x, y);
    // ショットが生きている状態（画面にいる）に設定
    this.life = 1;
  }
    /**
   *
   *
   */
    setVector(x, y) {
    this.vector.set(x, y);
    }
  /**
   * ショットの状態を更新して描画する
   */
  update() {
    // もし、ショットが死んでいる状態なら何もしない
    if (this.life <= 0) {
      return;
    }
    // ショットが画面外の座標になっていたら、死んでいる状態にする
    if (this.position.y + this.height < 0) {
      this.life = 0;
    }
    // ショットをベクトルに沿って移動させる
    this.position.x += this.vector.x * this.speed;
    this.position.y += this.vector.y * this.speed;
    // 移動させた後に描画する
    this.draw();
  }


}
