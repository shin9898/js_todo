import { EventEmitter } from "../EventEmitter.js";
import { TodoItemModel } from "./TodoItemModel.js";

/**
 * Todo一覧を管理するクラス
 * EventEmitterを継承してデータ変更時にイベント発火
 */
export class TodoListModel extends EventEmitter {
    constructor() {
        super();

        /** @type {TodoItemModel[]} Todoアイテムの配列 */
        this.items = [];
    }

    /**
     * 新しいTodoを追加
     * @param {string} text - Todoのテキスト
     * @returns {TodoItemModel} - 追加されたTodoアイテム
     * @throws {Error} - テキストが空の場合
     */
    addItem(text) {
        if (!text || text.trim() === '') {
            throw new Error('Todo text cannot be empty');
        }

        const todoItem = new TodoItemModel({ text: text.trim() });
        this.items.push(todoItem);

        // イベント発火
        this.emit('item:added', todoItem);
        this.emit('list:changed', this.getAllItems());
        this.emit('count:changed', this.getCount());

        return todoItem;
    }

    /**
     * Todoアイテムを削除
     * @param {number} id - 削除するTodoのID
     * @returns {boolean} - 削除に成功した場合true
     */
    deleteItem(id) {
        const initialLength = this.items.length;
        this.items = this.items.filter(item => item.id !== id);

        const deleted = this.items.length < initialLength;

        if (deleted) {
            this.emit('item:deleted', id);
            this.emit('list:changed', this.getAllItems());
            this.emit('count:changed', this.getCount());
        }

        return deleted;
    }

    /**
     * Todoアイテムを更新
     * @param {number} id - 更新するTodoのID
     * @param {Object} updates - 更新する内容
     * @param {string} [updates.text] - 新しいテキスト
     * @param {boolean} [updates.completed] - 新しい完了状態
     * @returns {boolean} - 更新に成功した場合true
     */
    updateItem(id, updates) {
        const item = this.items.find(item => item.id === id);

        if (!item) {
            return false;
        }

        let changed = false;

        if (updates.text !== undefined && updates.text !== item.text) {
            item.updateText(updates.text);
            changed = true;
        }

        if (updates.completed !== undefined && updates.completed !== item.completed) {
            item.completed = updates.completed;
            changed = true;
        }

        if (changed) {
            this.emit('item:updated', item);
            this.emit('list:changed', this.getAllItems());

            if (updates.completed !== undefined) {
                this.emit('item:toggled', item);
                this.emit('count:changed', this.getCount());
            }
        }

        return changed;
    }

    /**
     * 完了状態を切り替え
     * @param {number} id - 切り替えるTodoのID
     * @returns {boolean} - 切り替えに成功した場合true
     */
    toggleItem(id) {
        const item = this.items.find(item => item.id === id);

        if (!item) {
            return false;
        }

        item.toggleCompleted();

        this.emit('item:toggled', item);
        this.emit('item:updated', item);
        this.emit('list:changed', this.getAllItems());
        this.emit('count:changed', this.getCount());

        return true;
    }

    /**
     * 全てのTodoアイテムを取得
     * @returns {TodoItemModel[]} - Todoアイテムの配列をコピー
     */
    getAllItems() {
        return [...this.items];
    }

    /**
     * 完了済みのTodoアイテムを取得
     * @returns {TodoItemModel[]} - 完了済みTodoアイテムの配列
     */
    getCompletedItems() {
        return this.items.filter(item => item.completed);
    }

    /**
     * 未完了のTodoアイテムを取得
     * @returns {TodoItemModel[]} - 未完了のTodoアイテムの配列
     */
    getIncompleteItems() {
        return this.items.filter(item => !item.completed);
    }

    /**
     * タスクの数を取得
     * @returns {Object} {total: number, completed: number, incomplete: number}
     */
    getCount() {
        const total = this.items.length;
        const completed = this.getCompletedItems().length;
        const incomplete = this.getIncompleteItems().length;

        return { total, completed, incomplete };
    }

    /**
     * 特定のIDのアイテムを取得
     * @param {number} id - 取得するTodoのID
     * @returns {TodoItemModel|undefined} - 見つかったTodoアイテム、見つからない場合はundefined
     */
    getItemById(id) {
        return this.items.find(item => item.id === id);
    }

    /**
     * 全てのTodoアイテムを削除
     * @returns {number} - 削除されたアイテム数
     */
    clearAll() {
        const deletedCount = this.items.length;
        this.items = [];

        if (deletedCount > 0) {
            this.emit('list:cleared');
            this.emit('list:changed', this.getAllItems());
            this.emit('count:changed', this.getCount());
        }

        return deletedCount;
    }

    /**
     * 完了済みのTodoアイテムを全て削除
     * @returns {number} - 削除されたアイテム数
     */
    clearCompleted() {
        const initialLength = this.items.length;
        this.items = this.items.filter(item => !item.completed);
        const deletedCount = initialLength - this.items.length;

        if (deletedCount > 0) {
            this.emit('completed:cleared');
            this.emit('list:changed', this.getAllItems());
            this.emit('count:changed', this.getCount());
        }

        return deletedCount;
    }

}