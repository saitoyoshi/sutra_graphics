// 即時関数で変数スコープを限定
(() => {
  /**
   * キーが押されている状態を調べるためのオブジェクト
   * このオブジェクトをプロジェクトのどこからでも参照したいので、グローバルオブジェクトのプロパティとして設定する
   * @global
   * @type {object}
   */
  window.isKeyDown = {};
  /**
   *
   *
   *
   *
   *
   */
  window.gameScore = 0
  /**
   * canvasの幅
   * @type {number}
   */
  const CANVAS_WIDTH = 640;
  /**
   * canvasの高さ
   * @type {number}
   */
  const CANVAS_HEIGHT = 480;
  /**
   * 敵キャラクター(小)のインスタンス数
   */
  const ENEMY_SMALL_MAX_COUNT = 10;
  /**
   *
   */
  const ENEMY_LARGE_MAX_COUNT = 5;
  /**
   *
   */
  const SHOT_MAX_COUNT = 10;
  /**
   *
   *
   */
  const ENEMY_SHOT_MAX_COUNT = 50;
  /**
   *
   *
   */
  const EXPLOSION_MAX_COUNT = 10;
  /**
   *
   *
   */
  const BACKGROUND_STAR_MAX_COUNT = 100;
  /**
   *
   *
   */
  const BACKGROUND_STAR_MAX_SIZE = 3;
  /**
   *
   *
   */
  const BACKGROUND_STAR_MAX_SPEED = 4;
  /**
   * Canvas2D APIをラップしたユーティリティクラス
   * @type {Canvas2DUtility}
   */
  let util = null;
  /**
   * Canvas2D APIのコンテキスト
   * @type {CanvasRenderingContext2D}}
   */
  let ctx = null;
  /**
   *
   *
   *
   *
   */
  let scene = null;
  /**
   */
  // 実行開始時のタイスタンプ
  let startTime = null;
  let comingStart = null;
  /**
   *
   *
   *
   *
   *
   */
  let viper = null;
  /**
   *
   *
   */
  let enemyArray = [];
  let shotArray = [];
  /**
   *
   *
   *
   */







  let singleShotArray = [];
  /**
   *
   *
   */
  let enemyShotArray = [];
  /**
   *
   */
  let explosionArray = [];
  /**
   *
   *
   */
  let backgroundStarArray = [];
  /**
   *
   *
   */
  let restart = false;
  /**
   *
   *
   */
  let sound = null;
  /**
   * リソースがすべて読み込まれたら実行されるアクション
   */
  window.addEventListener(
    "load",
    () => {
      // ユーティリティクラスを使えるために準備する
      util = new Canvas2DUtility(document.querySelector("#main_canvas"));
      // ユーティリティクラスからHTMLcanvasElementへの参照を取得



      canvas = util.canvas;
      // 2Dレンダリングコンテキストを取得
      ctx = util.context;
      //
      canvas.width = CANVAS_WIDTH;
      canvas.height = CANVAS_HEIGHT;

      //
      let button = document.querySelector('#start_button');
      //
      button.addEventListener(
        'click',
        () => {
          //
          button.disabled = true;
          //
          sound = new Sound();
          //
          sound.load('./sound/explosion.mp3', (error) => {
            //
            if (error != null) {
              alert('ファイルの読み込みエラーです');
              return;
            }
          });
          initialize();
          //
          // インスタンスが読み込まれているか状態を確認する
          loadCheck();
        },
        false,
      );
      //
    },
    false
  );

  /**
   * canvasや２Dレンダリングコンテキストを初期化する
   */
  function initialize() {
    let i;

    //
    scene = new SceneManager();
    for (i = 0; i < EXPLOSION_MAX_COUNT; i++) {
      explosionArray[i] = new Explosion(ctx, 100.0, 15, 40.0, 1.0);
      //
      explosionArray[i].setSound(sound);
    }



    //
    // ショットを初期化する
    for (i = 0; i < SHOT_MAX_COUNT; i++) {
      shotArray[i] = new Shot(ctx, 0, 0, 32, 32, './image/viper_shot.png');
      singleShotArray[i * 2] = new Shot(ctx, 0, 0, 32, 32, './image/viper_single_shot.png');
      singleShotArray[i * 2 + 1] = new Shot(ctx, 0, 0, 32, 32, './image/viper_single_shot.png');
    }
    viper = new Viper(ctx, 0, 0, 64, 64, './image/viper.png');
    // 登場シーンから開始させる
    viper.setComing(
      CANVAS_WIDTH / 2,
      CANVAS_HEIGHT + 50,
      CANVAS_WIDTH / 2,
      CANVAS_HEIGHT - 100
    );
    viper.setShotArray(shotArray, singleShotArray);




















    //
    for (i = 0; i < ENEMY_SHOT_MAX_COUNT; i++) {
      enemyShotArray[i] = new Shot(ctx, 0, 0, 32, 32, './image/enemy_shot.png');
      enemyShotArray[i].setTargets([viper]);
      enemyShotArray[i].setExplosions(explosionArray);
    }

    // 敵キャラクター(小)を初期化
    for (i = 0; i < ENEMY_SMALL_MAX_COUNT; i++) {
      enemyArray[i] = new Enemy(ctx, 0, 0, 48, 48, './image/enemy_small.png');
      // 敵キャラクターはすべて同じショットを共有する
      enemyArray[i].setShotArray(enemyShotArray);
      //
      enemyArray[i].setAttackTarget(viper);
    }

    // 敵キャラクター(大)を初期化
    for (i = 0; i < ENEMY_LARGE_MAX_COUNT; i++) {
      enemyArray[ENEMY_SMALL_MAX_COUNT + i] = new Enemy(ctx, 0, 0, 64, 64, './image/enemy_large.png');
      // 敵キャラクターはすべて同じショットを共有する
      enemyArray[ENEMY_SMALL_MAX_COUNT + i].setShotArray(enemyShotArray);
      //
      enemyArray[ENEMY_SMALL_MAX_COUNT + i].setAttackTarget(viper);
    }

    // 衝突判定を行う対象を設定する
    //
    for (i = 0; i < SHOT_MAX_COUNT; i++) {
      shotArray[i].setTargets(enemyArray);
      singleShotArray[i * 2].setTargets(enemyArray);
      singleShotArray[i * 2 + 1].setTargets(enemyArray);
      shotArray[i].setExplosions(explosionArray);
      singleShotArray[i * 2].setExplosions(explosionArray);
      singleShotArray[i * 2 + 1].setExplosions(explosionArray);
    }









    //
    for (i = 0; i < BACKGROUND_STAR_MAX_COUNT; i++) {
      //
      let size = 1 + Math.random() * (BACKGROUND_STAR_MAX_SIZE - 1);
      let speed = 1 + Math.random() * (BACKGROUND_STAR_MAX_SPEED - 1);
      //
      backgroundStarArray[i] = new BackgroundStar(ctx, size, speed);
      //
      let x = Math.random() * CANVAS_WIDTH;
      let y = Math.random() * CANVAS_HEIGHT;
      backgroundStarArray[i].set(x, y);
    }
  }

  /**
   * インスタンスの準備が完了しているか確認する
   */
  function loadCheck() {
    // 準備が完了していればtrue
    let ready = true;
    // AND演算処理で、全体の準備完了の真偽値をもとめる
    ready = ready && viper.ready;
    //
    enemyArray.map(v => {
      ready = ready && v.ready;
    });
    //
    shotArray.map(v => {
      ready = ready && v.ready;
    });
    //
    singleShotArray.map(v => {
      ready = ready && v.ready;
    });
    //
    enemyShotArray.map(v => {
      ready = ready && v.ready;
    });

    // すべての準備が完了しているか、どうかで条件分岐
    if (ready === true) {
      //
      eventSetting();
      //
      sceneSetting();
      // 準備完了時のタイムスタンプを取得
      startTime = Date.now();
      //
      render();
    } else {
      //
      setTimeout(loadCheck, 100);
    }
  }
  function eventSetting() {
    // キーが押されたときに、実行したいアクションを登録
    window.addEventListener(
      "keydown",
      (e) => {
        // キーが押されたことを管理しているグローバルオブジェクトにキーが押されたという状態をプロパティとしてもたせる
        isKeyDown[`key_${e.key}`] = true;
        if (e.key === 'Enter') {
          //
          if (viper.life <= 0) {
            restart = true;
          }
        }
      },
      false
    );
    // キーが離されたときに、実行されるアクションを設定
    window.addEventListener(
      "keyup",
      (e) => {
        // キーが離されたという状態をもたせる
        isKeyDown[`key_${e.key}`] = false;
      },
      false
    );
  }
  /**
   *
   */

  function sceneSetting() {
    scene.add('intro', time => {
      if (time > 3.0) {
        scene.use('invade_default_type');
      }
    });
    scene.add('invade_default_type', time => {
      //
      if (scene.frame % 30 === 0) {
        //
        for (let i = 0; i < ENEMY_SMALL_MAX_COUNT; i++) {
          if (enemyArray[i].life <= 0) {
            let e = enemyArray[i];
            //
            //
            if (scene.frame % 60 === 0) {
              //
              e.set(-e.width, 30, 2, 'default');
              e.setVectorFromAngle(degreesToRadians(30));
            } else {
              e.set(CANVAS_WIDTH + e.width, 30, 2, 'default');
              e.setVectorFromAngle(degreesToRadians(150));
            }
            break;
          }
        }

      }
      if (scene.frame === 270) {
        scene.use('blank');
      }
      //
      if (viper.life <= 0) {
        scene.use('gameover');
      }
    });
    //
    scene.add('blank', time => {
      //
      if (scene.frame === 150) {
        scene.use('invade_wave_move_type');
      }
      if (viper.life <= 0) {
        scene.use('gameover');
      }
    });

    scene.add('invade_wave_move_type', time => {
      //
      if (scene.frame % 50 === 0) {
        //
        for (let i = 0; i < ENEMY_SMALL_MAX_COUNT; i++) {
          if (enemyArray[i].life <= 0) {
            let e = enemyArray[i];
            //
            //
            if (scene.frame <= 200) {
              //
              e.set(CANVAS_WIDTH * 0.2, -e.height, 2, 'wave');
            } else {
              //
              e.set(CANVAS_WIDTH * 0.8, -e.height, 2, 'wave');

            }
            break;
          }
        }
      }
      //
      if (scene.frame === 450) {
        scene.use('invade_large_type');
      }
      if (viper.life <= 0) {
        scene.use('gameover');
      }
    });
    //
    scene.add('invade_large_type', time => {
      //
      if (scene.frame === 100) {
        //
        let i = ENEMY_SMALL_MAX_COUNT + ENEMY_LARGE_MAX_COUNT;

        for (let j = ENEMY_SMALL_MAX_COUNT; j < i; j++) {
          if (enemyArray[j].life <= 0) {
            let e = enemyArray[j];
            //
            e.set(CANVAS_WIDTH / 2, -e.height, 50, 'large');
            break;
          }
        }
      }
      //
      if (scene.frame === 500) {
        scene.use('intro');
      }
    });
    //
    scene.add('gameover', time => {
      //
      let textWidth = CANVAS_WIDTH / 2;
      //
      let loopWidth = CANVAS_WIDTH + textWidth;
      //
      let x = CANVAS_WIDTH - ((scene.frame * 2) % loopWidth)
      //
      ctx.font = 'bold 72px sans-serif';
      util.drawText('GAME OVER', x, CANVAS_HEIGHT / 2, 'green', textWidth);





      if (restart === true) {
        restart = false;
        //
        gameScore = 0;
        viper.setComing(
          CANVAS_WIDTH / 2,
          CANVAS_HEIGHT + 50,
          CANVAS_WIDTH / 2,
          CANVAS_HEIGHT - 100,
        );
        //
        scene.use('intro');
      }
    });
    scene.use('intro');
  }



















  function render() {
    // キャンバス描画を完全な不透明にする
    ctx.globalAlpha = 1.0;
    //
    util.drawRect(0, 0, canvas.width, canvas.height, "black");

    // 現在までの経過時間を取得
    let nowTime = (Date.now() - startTime) / 1000;

    //
    ctx.font = 'bold 24px monospace';
    util.drawText(zeroPadding(gameScore, 5), 30, 50, '#111111');
    scene.update();

    //
    backgroundStarArray.map(v => {
      v.update();
    });
    // viperを更新して描画
    viper.update();

    enemyArray.map(v => {
      v.update();
    })

    // ショットの状態を更新した後に描画
    shotArray.map(v => {
      v.update();
    });
    //
    singleShotArray.map(v => {
      v.update();
    });

    enemyShotArray.map(v => {
      v.update();
    });

    //
    explosionArray.map(v => {
      v.update();
    });
    // ずっとループさせつづけるために、描画処理を再帰呼び出し
    requestAnimationFrame(render);
  }









  /**
   *
   *
   */
  function generateRandomInt(range) {
    let random = Math.random();
    return Math.floor(random * range);
  }

  /**
   *
   *
   */
  function degreesToRadians(degrees) {
    return (degrees * Math.PI) / 180;
  }
  /**
   *
   *
   *
   */
  function zeroPadding(number, count) {
    //
    let zeroArray = new Array(count);
    //
    let zeroString = zeroArray.join('0') + number;
    //
    return zeroString.slice(-count);
  }
})();
