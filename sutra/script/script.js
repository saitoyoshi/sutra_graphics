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
   *
   */
  const SHOT_MAX_COUNT = 10;
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
   */
  // 実行開始時のタイスタンプ
  let startTime = null;
  let comingStart = null;
  /**
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
  let shotArray = [];
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
    canvas.window = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    viper = new Viper(ctx, 0, 0, 64, 64, './image/viper.png');
    // 登場シーンから開始させる
    viper.setComing(
      CANVAS_WIDTH / 2,
      CANVAS_HEIGHT + 50,
      CANVAS_WIDTH / 2,
      CANVAS_HEIGHT - 100
    );
    // ショットを初期化する
    for (let i = 0; i < SHOT_MAX_COUNT; i++) {
      shotArray[i] = new Shot(ctx, 0, 0, 32, 32, './image/viper_shot.png');
    }
    viper.setShotArray(shotArray);
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
    shotArray.map(v => {
      ready = ready && v.ready;
    });

    // すべての準備が完了しているか、どうかで条件分岐
    if (ready === true) {
      //
      eventSetting();
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
  function render() {
    // キャンバス描画を完全な不透明にする
    ctx.globalAlpha = 1.0;
    //
    util.drawRect(0, 0, canvas.width, canvas.height, "black");

    // 現在までの経過時間を取得
    let nowTime = (Date.now() - startTime) / 1000;

    // viperを更新して描画
    viper.update();

    // ショットの状態を更新した後に描画
    shotArray.map(v => {
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
