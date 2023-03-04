// 即時関数で変数スコープを限定
(() => {
    /**
     * canvasの幅
     * @type {number}
     */
    const CANVAS_WIDTH = 480;
    /**
     * canvasの高さ
     * @type {number}
     */
    const CANVAS_HEIGHT = 320;

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
     */
    let image = null;

    /**
     * リソースがすべて読み込まれたら実行されるアクション
     */
    window.addEventListener('load',
    () => {
        // ユーティリティクラスを使えるために準備する
        util = new Canvas2DUtility(document.querySelector('#main_canvas'));
        // ユーティリティクラスからHTMLcanvasElementへの参照を取得
        canvas = util.canvas;
        // 2Dレンダリングコンテキストを取得
        ctx = util.context;

        // まず最初に画像の読み込みを開始
        util.imageLoader('./image/viper.png', loadedImage => {
            // 引数経由で画像を受け取り変数に入れておく
            image = loadedImage;
            //
            initialize();
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
        //
        canvas.window = CANVAS_WIDTH;
        canvas.height = CANVAS_HEIGHT;
    }

    /**
     *
     */
    function render() {
        //
        util.drawRect(0, 0, canvas.width, canvas.height, 'black');
        //
        ctx.drawImage(image, 100, 100);
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
