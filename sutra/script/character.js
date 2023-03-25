/**
 * 座標概念を使用するためのクラス
 */
class Position {
  /**
   *
   *
   *
   *
   *
   */
  static calcLength(x, y) {
    return Math.sqrt(x * x + y * y);
  }
  /**
   *
   *
   *
   *
   *
   */
  static calcNormal(x, y) {
    let len = Position.calcLength(x, y);
    return new Position(x / len, y / len);
  }
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

  /**
   *
   *
   */
  distance(target) {
    let x = this.x - target.x;
    let y = this.y - target.y;
    return Math.sqrt(x * x + y * y);
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
     *
     *
     */
    this.vector = new Position(0.0, -1.0);
    /**
     *
     *
     *
     */
    this.angle = (270 * Math.PI) / 180; //270度
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
   *
   *
   */
  setVector(x, y) {
    this.vector.set(x, y);
  }

  /**
   *
   *
   */
  setVectorFromAngle(angle) {
    this.angle = angle;
    let sin = Math.sin(angle);
    let cos = Math.cos(angle);
    this.vector.set(cos, sin);
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
  rotationDraw() {
    this.ctx.save();
    this.ctx.translate(this.position.x, this.position.y);
    // 270度の位置を基準とするため
    this.ctx.rotate(this.angle - Math.PI * 1.5);

    //
    let offsetX = this.width / 2;
    let offsetY = this.height / 2;
    this.ctx.drawImage(
      this.image,
      -offsetX,
      -offsetY,
      this.width,
      this.height,
    );

    // 回転する前の状態に復元する
    this.ctx.restore();
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
    super(ctx, x, y, w, h, 1, imagePath);

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
    this.life = 1;
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
    //
    if (this.life <= 0) {
      return;
    }
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
              this.shotArray[i].setPower(2);
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
              //
              let radCW = (280 * Math.PI) / 180;
              let radCWW = (260 * Math.PI) / 180;
              // viperのいる座標にショットを生成
              this.singleShotArray[i].set(this.position.x, this.position.y);
              this.singleShotArray[i].setVectorFromAngle(radCW);
              this.singleShotArray[i + 1].set(this.position.x, this.position.y);
              this.singleShotArray[i + 1].setVectorFromAngle(radCWW);
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
class Enemy extends Character {
  /**
   *
   *
   *
   *
   *
   */
  constructor(ctx, x, y, w, h, imagePath) {
    super(ctx, x, y, w, h, 0, imagePath);

    this.type = 'default';
    /**
     * Enemyが出現してからフレーム数
     *
     */
    this.frame = 0;
    this.speed = 3;
    /**
     * Enemyが持っているショットのインスタンスの配列
     *
     */
    this.shotArray = null;
    /**
     *
     *
     */
    this.attackTarget = null;
  }

  /**
   *
   *
   */
  set(x, y, life = 1, type = 'default') {
    this.position.set(x, y);
    // 敵キャラクターを生きている状態で配置
    this.life = life;
    //
    this.type = type;
    // Enemyのフレームを0にリセットする
    this.frame = 0;
  }

  /**
   * Enemyが持つショットのインスタンスの配列の設定をする
   *
   */
  setShotArray(shotArray) {
    this.shotArray = shotArray;
  }

  /**
   *
   *
   *
   */
  setAttackTarget(target) {
    this.attackTarget = target;
  }
  /**
   *
   */
  update() {
    // 死んでればなにもしない
    if (this.life <= 0) {
      return;
    }
    //







    switch(this.type) {
      //
      //
      case 'wave':
        //
        if (this.frame % 60 === 0) {
          //
          let tx = this.attackTarget.position.x - this.position.x;
          let ty = this.attackTarget.position.y - this.position.y;
          //
          let tv = Position.calcNormal(tx, ty);

          this.fire(tv.x, tv.y, 4.0);
        }
        //
        this.position.x += Math.sin(this.frame / 10);
        this.position.y += 2.0;
        //
        if (this.position.y - this.height > this.ctx.canvas.height) {
          this.life = 0;
        }
        break;
        //
        //
      case 'large':
        //
        if (this.frame % 50 === 0) {
          //
          for (let i = 0; i < 360; i += 45) {
            let r = (i * Math.PI) / 180;
            //
            let c = Math.cos(r);
            let s = Math.sin(r);
            //
            this.fire(c, s, 3.0);
          }
        }
        //
        this.position.x += Math.sin((this.frame + 90) / 50) * 2.0;
        this.position.y += 1.0;
        //
        if (this.position.y - this.height > this.ctx.canvas.height) {
          this.life = 0;
        }
        break;
      case 'default':
      default:
        // console.log(this.frame);
        if (this.frame === 100) {
          this.fire();
        }
        // 敵キャラを進行方向に向かって移動させる
        this.position.x += this.vector.x * this.speed;
        this.position.y += this.vector.y * this.speed;
      // 画面外にでていたら死んでいる状態にする
        if (this.position.y - this.height > this.ctx.canvas.height) {
          this.life = 0;
        }
        break;
    }

    //
    this.frame++;
    this.draw();
  }
  /**
   *
   */
  fire(x = 0.0, y = 1.0, speed = 5.0) {
    for (let i = 0; i < this.shotArray.length; i++) {
      // ショットが死んでいるかチェック
      if (this.shotArray[i].life <= 0) {
        this.shotArray[i].set(this.position.x, this.position.y);
        //
        this.shotArray[i].setSpeed(speed);
        //
        this.shotArray[i].setVector(x, y);
        //
        break;
      }
    }

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
    this.power = 1;
    /**
     *
     *
     */
    this.targetArray = [];




































    /**
     *
     * 爆発エフェクトのインスタンスを格納する
     */
    this.explosionArray = [];
  }

  /**
   * ショットをキャンバス上に配置する
   */
  set(x, y, speed, power) {
    this.position.set(x, y);
    // ショットが生きている状態（画面にいる）に設定
    this.life = 1;
    this.setSpeed(speed);
    //
    this.setPower(power);
  }
  /**
   *
   *
   */
  setSpeed(speed) {
    //
    if (speed != null && speed > 0) {
      this.speed = speed;
    }
  }
  /**
   *
   *
   */
  setPower(power) {
    //
    if (power != null && power > 0) {
      this.power = power;
    }
  }

  /**
   *
   *
   */
  setTargets(targets) {
    if (
      targets != null &&
      Array.isArray(targets) === true &&
      targets.length > 0
    ) {
      this.targetArray = targets;
    }
  }
  setExplosions(targets) {
    if (
      targets != null &&
      Array.isArray(targets) === true &&
      targets.length > 0
    ) {
      this.explosionArray = targets;
    }
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
    if (this.position.x + this.width < 0 || this.position.x - this.width > this.ctx.canvas.width || this.position.y + this.height < 0 ||
      this.position.y - this.height > this.ctx.canvas.height) {
      this.life = 0;
    }
    // ショットをベクトルに沿って移動させる
    this.position.x += this.vector.x * this.speed;
    this.position.y += this.vector.y * this.speed;
    this.targetArray.map(v => {
      if (this.life <= 0 || v.life <= 0) {
        return;
      }
      let dist = this.position.distance(v.position);
      //
      if (dist <= (this.width + v. width) / 4) {
        //
        if (v instanceof Viper === true) {
          if (v.isComing === true) {
            return;
          }
        }
        v.life -= this.power;
        //
        //
        if (v.life <= 0) {
          for (let i = 0; i < this.explosionArray.length; i++) {
            //
            if (this.explosionArray[i].life !== true) {
              this.explosionArray[i].set(v.position.x, v.position.y);
              break;
            }
          }
          if (v instanceof Enemy === true) {
            //
            //
            let score = 100;
            if (v.type === 'large') {
              score = 1000;
            }
            gameScore = Math.min(gameScore + score, 99999);
          }
        }
        this.life = 0;
      }
    });
    // 座標系の回転を考慮して、画面に描写する
    this.rotationDraw();
  }
}

/**
 *
 */
class Explosion {
  /**
   *
   *
   *
   *
   *
   *
   *
   */
  constructor(ctx, radius, count, size, timeRange, color = '#ff1166') {
    /**
     *
     */
    this.ctx = ctx;
    /**
     *
     * 爆発インスタンスが死んでいればfalse
     */
    this.life = false;
    /**
     *
     *
     */
    this.color = color;
    /**
     *
     *
     */
    this.position = null;
    /**
     *
     *
     */
    this.radius = radius;
    /**
     *
     *
     */
    this.count = count;
    /**
     * 爆発が始まった瞬間のタイムスタンプ
     *
     */
    this.startTime = 0;
    /**
     * 爆発が消えるまでの時間
     *
     */
    this.timeRange = timeRange;
    /**
     *
     *
     */
    this.fireBaseSize = size;
    /**
     *
     *
     */
    this.fireSize = [];
    /**
     * 火花の位置を格納する配列
     *
     */
    this.firePosition = [];
    /**
     *
     *
     */
    this.fireVector = [];
  }

  /**
   *
   *
   *
   */
  set(x, y) {
    //
    for (let i = 0; i < this.count; i++) {
      //
      this.firePosition[i] = new Position(x, y);

      // ランダムに火花が進む方向を決めるラジアンを取得
      let vr = Math.random() * Math.PI * 2.0;
      //
      let s = Math.sin(vr);
      let c = Math.cos(vr);
      //
      let mr = Math.random();
      this.fireVector[i] = new Position(c * mr, s * mr);
      this.fireSize[i] = (Math.random() * 0.5 + 0.5) * this.fireBaseSize;
    }
    // 爆発を生きている状態に設定
    this.life = true;
    //
    this.startTime = Date.now();
  }

  /**
   *
   */
  update() {
    // 爆発が生きているか死んでいるか確認する
    if (this.life !== true) {
      return;
    }
    //
    this.ctx.fillStyle = this.color;
    this.ctx.globalAlpha = 0.5;
    // 爆発が発生してからの経過時間を求める
    let time = (Date.now() - this.startTime) / 1000;

    let ease = simpleEaseIn(1.0 - Math.min(time / this.timeRange, 1.0));
    //
    let progress = 1 - ease;

    //
    for (let i = 0; i < this.firePosition.length; i++) {
      //
      let d = this.radius * progress;
      //
      let x = this.firePosition[i].x + this.fireVector[i].x * d;
      let y = this.firePosition[i].y + this.fireVector[i].y * d;
      //
      let s = 1.0 - progress;
      //
      this.ctx.fillRect(
        x - (this.fireSize[i] * s) / 2,
        y - (this.fireSize[i] * s) / 2,
        this.fireSize[i] * s,
        this.fireSize[i] * s,
      );
    }

    //
    // 進捗が100%までいってたら死んでいる状態にする
    if (progress >= 1.0) {
      this.life = false;
    }
  }
}

/**
 *
 */
class BackgroundStar {
  /**
   *
   *
   *
   *
   *
   *
   */
  constructor(ctx, size, speed, color = '#ffffff') {
    /**
     *
     */
    this.ctx = ctx;
    /**
     *
     *
     */
    this.size = size;
    /**
     *
     *
     */
    this.speed = speed;
    /**
     *
     *
     */
    this.color = color;
    /**
     *
     *
     */
    this.position = null;
  }

  /**
   *
   *
   */
  set(x, y) {
    this.position = new Position(x, y);
  }
  /**
   *
   */
  update() {
    //
    this.ctx.fillStyle = this.color;
    //
    this.position.y += this.speed;
    //
    this.ctx.fillRect(
      this.position.x - this.size / 2,
      this.position.y - this.size / 2,
      this.size,
      this.size
    );
    //
    if (this.position.y + this.size > this.ctx.canvas.height) {
      this.position.y = -this.size;
    }
  }
}

function simpleEaseIn(t) {
  return t * t * t * t;
}
