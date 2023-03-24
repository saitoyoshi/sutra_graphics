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
   * canvasの幅
   * @type {number}
   */
  const CANVAS_WIDTH = 400;
  /**
   * canvasの高さ
   * @type {number}
   */
  const CANVAS_HEIGHT = 620;
  /**
   * 敵キャラクターのインスタンス数
   */
  const ENEMY_MAX_COUNT = 10;
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
  let restart = false;
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
      initialize();
      //
      // インスタンスが読み込まれているか状態を確認する
      loadCheck();
    },
    false
  );

  /**
   * canvasや２Dレンダリングコンテキストを初期化する
   */
  function initialize() {
    let i;
    canvas.window = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    //
    scene = new SceneManager();
    for (i = 0; i < EXPLOSION_MAX_COUNT; i++) {
      explosionArray[i] = new Explosion(ctx, 100.0, 15, 40.0, 1.0);
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

    // 敵キャラクターを初期化
    for (i = 0; i < ENEMY_MAX_COUNT; i++) {
      enemyArray[i] = new Enemy(ctx, 0, 0, 48, 48, './image/enemy_small.png');
      // 敵キャラクターはすべて同じショットを共有する
      enemyArray[i].setShotArray(enemyShotArray);
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
      if (time > 2.0) {
        scene.use('invade');
      }
    });
    scene.add('invade', time => {
      //
      if (scene.frame === 0) {
        //
        for (let i = 0; i < ENEMY_MAX_COUNT; i++) {
          if (enemyArray[i].life <= 0) {
            let e = enemyArray[i];
            e.set(CANVAS_WIDTH / 2, -e.height, 2, 'default');
            e.setVector(0.0, 1.0);
            break;
          }
        }

      }
      if (scene.frame === 100) {
        scene.use('invade');
      }
      //
      if (viper.life <= 0) {
        scene.use('gameover');
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
      //
      if (restart === true) {
        //
        restart = false;
        //
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

    scene.update();
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
})();
