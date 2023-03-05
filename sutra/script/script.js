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
   * 画像のインスタンス
   *
   */

  let image = null;
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

      // まず最初に画像の読み込みを開始
      util.imageLoader("./image/viper.png", (loadedImage) => {
        // 引数経由で画像を受け取り変数に入れておく

        image = loadedImage;
        //
        initialize();
        //
        eventSetting();
        //
        startTime = Date.now(); //now()はDateオブジェクトの静的メソッド
        //
        render();
      });
    },
    false
  );

  /**
   * canvasや２Dレンダリングコンテキストを初期化する
   */
  function initialize() {
    canvas.window = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    viper = new Viper(ctx, 0, 0, 64, 64, image);
    // 登場シーンから開始させる
    viper.setComing(
      CANVAS_WIDTH / 2,
      CANVAS_HEIGHT + 50,
      CANVAS_WIDTH / 2,
      CANVAS_HEIGHT - 100
    );
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
