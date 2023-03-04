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
    set(x,y) {
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
    constructor(ctx, x, y, life, image) {
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
        this.ctx.drawImage(this.image, this.position.x, this.position.y);
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
     */
    constructor(ctx, x, y, image) {
        //
        //
        // インスタンス化したときには、ライフは画面に描画されないためのフラグとして,0を与える
        super(ctx, x, y, 0, image);

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
        this.comingEndPosition = new Position(endX, endY);
    }
}
