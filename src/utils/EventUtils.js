/**
 * Todo関連のCustomEvent作成ユーティリティ
 */
export class EventUtils {
    /**
     * 汎用的なCustomEventを作成
     * @param {string} eventName - イベント名
     * @param {Object} detail - イベントの詳細データ
     * @returns {CustomEvent}
     */
    static createCustomEvent(eventName, detail) {
        return new CustomEvent(eventName, {
            detail,
            bubbles: true,
            cancelable: true
        });
    }

    /**
     * Todo追加イベントを作成
     * @param {string} text - Todoテキスト
     * @returns {CustomEvent}
     */
    static createAddEvent(text) {
        return new CustomEvent('todo:add', {
            detail: { text }
        });
    }

    /**
     * Todo切り替えイベントを作成
     * @param {number} id - TodoのID
     * @param {boolean} completed - 新しい完了状態
     * @returns {CustomEvent}
     */
    static createToggleEvent(id, completed) {
        return new CustomEvent('todo:toggle', {
            detail: { id, completed },
            bubbles: true,
            cancelable: true
        });
    }

    /**
     * Todo更新イベントを作成
     * @param {number} id - TodoのID
     * @param {string} text - 新しいテキスト
     * @returns {CustomEvent}
     */
    static createUpdateEvent(id, text) {
        return new CustomEvent('todo:update', {
            detail: { id, text },
            bubbles: true,
            cancelable: true
        });
    }

    /**
     * Todo削除イベントを作成
     * @param {number} id - TodoのID
     * @returns {CustomEvent}
     */
    static createDeleteEvent(id) {
        return new CustomEvent('todo:delete', {
            detail: { id },
            bubbles: true,
            cancelable: true
        });
    }
}