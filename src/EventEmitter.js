export class EventEmitter {
    /** @type {Map<string, Function[]>} イベント名とリスナーのマップ */
    #listeners = new Map();

    /**
     * イベントリスナーを登録
     * @param {string} eventName - イベント名
     * @param {Function} listener - リスナー関数
     * @returns {EventEmitter} メソッドチェーン用
     */
    on(eventName, listener) {
        if (!this.#listeners.has(eventName)) {
            this.#listeners.set(eventName, []);
        }
        this.#listeners.get(eventName).push(listener);
        return this;
    }

    /**
     * 一度だけ実行されるイベントリスナーを登録
     * @param {string} eventName - イベント名
     * @param {Function} listener - リスナー関数
     * @returns {EventEmitter} メソッドチェーン用
     */
    once(eventName, listener) {
        const onceListener = (...args) => {
            listener(...args);
            this.off(eventName, onceListener);
        };
        return this.on(eventName, onceListener);
    }

    /**
     * イベントリスナーを削除
     * @param {string} eventName - イベント名
     * @param {Function} listener - 削除するリスナー関数
     * @returns {EventEmitter} メソッドチェーン用
     */
    off(eventName, listener) {
        if (!this.#listeners.has(eventName)) {
            return this;
        }

        const listeners = this.#listeners.get(eventName);
        const index = listeners.indexOf(listener);

        if (index > -1) {
            listeners.splice(index, 1);
        }

        // リスナーが空になったらMapから削除
        if (listeners.length === 0) {
            this.#listeners.delete(eventName);
        }

        return this;
    }

    /**
     * イベントを発火
     * @param {string} eventName - イベント名
     * @param {...any} args - リスナーに渡す引数
     * @returns {EventEmitter} メソッドチェーン用
     */
    emit(eventName, ...args) {
        if (!this.#listeners.has(eventName)) {
            return this;
        }

        const listeners = this.#listeners.get(eventName);

        // リスナーを複製してから実行（実行中の変更に対応）
        [...listeners].forEach(listener => {
            try {
                listener(...args);
            } catch (error) {
                console.error(`Error in event listener for '${eventName}':`, error);
            }
        });

        return this;
    }

    /**
     * 指定したイベントのすべてのリスナーを削除
     * @param {string} eventName - イベント名
     * @returns {EventEmitter} メソッドチェーン用
     */
    removeAllListeners(eventName) {
        if (eventName) {
            this.#listeners.delete(eventName);
        } else {
            this.#listeners.clear();
        }
        return this;
    }

    /**
     * 指定したイベントのリスナー数を取得
     * @param {string} eventName - イベント名
     * @returns {number} リスナー数
     */
    listenerCount(eventName) {
        return this.#listeners.has(eventName) ?
            this.#listeners.get(eventName).length : 0;
    }

    /**
     * 登録されているイベント名の一覧を取得
     * @returns {string[]} イベント名の配列
     */
    eventNames() {
        return Array.from(this.#listeners.keys());
    }
}