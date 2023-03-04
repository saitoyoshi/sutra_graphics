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
        canvas.window = CANVAS_WIDTH;
        canvas.height = CANVAS_HEIGHT;

        viper = new Viper(ctx, 0 ,0, image);
        viper.setComing(
          CANVAS_WIDTH / 2,
          CANVAS_HEIGHT,
          CANVAS_WIDTH / 2,
          CANVAS_HEIGHT - 100,
        );
    }
    function eventSetting() {
        // キーが押されたときに、実行したいアクションを登録
        window.addEventListener('keydown', e => {
            // 登場シーン中はキーの入力を無視する
            if (viper.isComing === true) {
                return;
            }
            switch (e.key) {
                case 'ArrowLeft':
                    viper.position.x -= 10;
                    break;
                case 'ArrowRight':
                    viper.position.x += 10;
                    break;
                case 'ArrowUp':
                    viper.position.y -= 10;
                    break;
                case 'ArrowDown':
                    viper.position.y += 10;
                    break;
            }
        },false);
    }
    /**
     *
     */
    function render() {
        // キャンバス描画を完全な不透明にする
        ctx.globalAlpha = 1.0;
        //
        util.drawRect(0, 0, canvas.width, canvas.height, 'black');
        // 現在までの経過時間を取得
        let nowTime = (Date.now() - startTime) / 1000;

        //viper登場シーン
        if (viper.isComing === true) {
            // 登場シーンが始まってからの経過時間を取得する
            let justTime = Date.now();
            let comingTime = (justTime - viper.comingStart) / 1000;
            // 登場中は時間経過に合わせて上方にすすむ
            let y = CANVAS_HEIGHT - comingTime * 50;
            // ある程度の位置まで上にきたら、登場シーンを終了させ、位置も固定する
            if (y <= viper.comingEndPosition.y) {
                viper.isComing = false;
                y = viper.comingEndPosition.y;
            }
            //
            viper.position.set(viper.position.x, y);
            // 現在時刻の秒数が4で割り切れるときに、viperを半透明にする、目的は、viperを点滅させること
            if (justTime % 4 === 0) {
                ctx.globalAlpha = 0.5;
            }
        }
        viper.draw();

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
