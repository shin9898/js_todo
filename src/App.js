import { TodoListModel } from './model/TodoListModel.js';
import { TodoFormView } from './view/TodoFormView.js';
import { TodoListView } from './view/TodoListView.js';

/**
 * Todoアプリケーションのメインクラス
 * 全コンポーネントの統合と制御を担当
 */
export class App {
    constructor() {
        // Model初期化
        this.todoListModel = new TodoListModel();

        // DOM要素取得
        this.formElement = document.querySelector('.input-group')?.parentElement;
        this.listElement = document.getElementById('todoItems');
        this.counterElement = document.getElementById('taskCounter');

        if (!this.formElement || !this.listElement || !this.counterElement) {
            throw new Error('必要なDOM要素が見つかりません');
        }

        // View初期化
        this.todoFormView = new TodoFormView(this.formElement);
        this.todoListView = new TodoListView(this.listElement, this.counterElement);

        // イベント連携
        this.#bindEvents();

        // 初期表示
        this.#render();
    }

    /**
     * 全イベント連携を設定
     */
    #bindEvents() {
        // 重複実行防止用のフラグ
        let isToggleProcessing = false;
        let isUpdateProcessing = false;
        let isDeleteProcessing = false;

        // 1. TodoFormView → App → TodoListModel（新規追加）
        this.formElement.addEventListener('todo:add', (event) => {
            this.#handleAddTodo(event.detail.text);
        });

        // 2. TodoListView → App → TodoListModel（操作系）
        document.addEventListener('todo:toggle', (event) => {
            if (isToggleProcessing) return;
            isToggleProcessing = true;

            this.#handleToggleTodo(event.detail.id, event.detail.completed);

            setTimeout(() => { isToggleProcessing = false; }, 50);
        });

        document.addEventListener('todo:update', (event) => {
            if (isUpdateProcessing) return;
            isUpdateProcessing = true;

            this.#handleUpdateTodo(event.detail.id, event.detail.text);

            setTimeout(() => { isUpdateProcessing = false; }, 50);
        });

        document.addEventListener('todo:delete', (event) => {
            if (isDeleteProcessing) return;
            isDeleteProcessing = true;

            this.#handleDeleteTodo(event.detail.id);

            setTimeout(() => { isDeleteProcessing = false; }, 50);
        });

        // 3. TodoListModel → App → TodoListView（データ変更通知）
        this.todoListModel.on('list:changed', () => {
            this.#render();
        });
    }

    /**
     * View層にModelデータを反映
     */
    #render() {
        const todoItems = this.todoListModel.getAllItems();
        this.todoListView.render(todoItems);
    }

    /**
     * Todo追加処理
     * @param {string} text - 追加するTodoのテキスト
     */
    #handleAddTodo(text) {
        try {
            const addedItem = this.todoListModel.addItem(text);
        } catch (error) {
            alert(error.message);
        }
    }

    /**
     * Todo完了状態切り替え処理
     * @param {number} id - TodoのID
     * @param {boolean} completed - 新しい完了状態
     */
    #handleToggleTodo(id, completed) {
        const success = this.todoListModel.updateItem(id, { completed });
    }

    /**
     * Todoテキスト更新処理
     * @param {number} id - TodoのID
     * @param {string} text - 新しいテキスト
     */
    #handleUpdateTodo(id, text) {
        try {
            const success = this.todoListModel.updateItem(id, { text });
        } catch (error) {
            alert(error.message);
        }
    }

    /**
     * Todo削除処理
     * @param {number} id - TodoのID
     */
    #handleDeleteTodo(id) {
        const success = this.todoListModel.deleteItem(id);
    }
}