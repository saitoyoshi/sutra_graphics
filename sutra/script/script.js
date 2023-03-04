// 即時関数で変数スコープを限定
(() => {
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
     *
     *
     */
    // 実行開始時のタイスタンプ
    let startTime = null;
    /**
     * viper x position
     *
     */
    let viperX = CANVAS_WIDTH / 2;
    /**
     * viper y position
     *
     */
    let viperY = CANVAS_HEIGHT / 2;
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
            eventSetting();
            //
            startTime = Date.now();//now()はDateオブジェクトの静的メソッド
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
    function eventSetting() {
        // キーが押されたときに、実行したいアクションを登録
        window.addEventListener('keydown', e => {
            switch (e.key) {
                case 'ArrowLeft':
                    viperX -= 10;
                    break;
                case 'ArrowRight':
                    viperX += 10;
                    break;
                case 'ArrowUp':
                    viperY -= 10;
                    break;
                case 'ArrowDown':
                    viperY += 10;
                    break;
            }
        },false);
    }
    /**
     *
     */
    function render() {
        //
        util.drawRect(0, 0, canvas.width, canvas.height, 'black');
        // 現在までの経過時間を取得
        let nowTime = (Date.now() - startTime) / 1000;

        ctx.drawImage(image,viperX, viperY);

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
