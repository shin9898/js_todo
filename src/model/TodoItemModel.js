let todoIdx = 0;

/**
 * 個別のTodoアイテムを表すクラス
 * 各Todoの状態(ID、テキスト、完了状態)を管理
 */
export class TodoItemModel {
    /**
     * TodoItemを作成
     * @param {Object} options - Todo項目のオプション
     * @param {string} options.text - Todoのテキスト
     * @param {boolean} [options.completed=false] - 完了状態
     */
    constructor({ text, completed = false }) {
        /** @type {number} 一意のID（自動採番） */
        this.id = ++todoIdx;
        /** @type {string} Todoのテキスト内容 */
        this.text = text;
        /** @type {boolean} 完了状態（true: 完了, false: 未完了) */
        this.completed = completed;
    }

    /**
     * 完了状態の切り替え
     * @returns {void}
     */
    toggleCompleted() {
        this.completed = !this.completed;
    }

    /**
     * Todoのテキストを更新
     * @param {string} newText - 新しいテキスト
     * @throws {Error} newTextが空文字または空白のみの場合
     * @returns {void}
     */
    updateText(newText) {
        if (!newText || newText.trim() === '') {
            throw new Error("Todo text cannot be empty");
        }
        this.text = newText.trim();
    }

    /**
     * TodoItemの複製を作成
     * 新しいIDが自動で割り当てられる
     * @returns {TodoItemModel} 複製されたTodoItemインスタンス
     */
    clone() {
        return new TodoItemModel({
            text: this.text,
            completed: this.completed
        });
    }

    /**
     * TodoItemの文字列表現を返す(デバッグ用)
     * @returns {string} "[ID: 1]掃除（未完了）"のような形式
     */
    toString() {
        const status = this.completed ? '完了' : '未完了';
        return `[ID: ${this.id}] ${this.text} (${status})`;
    }
}

/**
 * 現在のIDカウンターの値を取得(デバッグ用)
 * @returns {number} 現在のIDカウンター値
 */
export function getCurrentTodoIdx() {
    return todoIdx;
}

/**
 * IDカウンターをリセット(テスト用)
 * 通常の使用では呼び出さない
 * @returns {void}
 */
export function resetTodoIdx() {
    todoIdx = 0;
}