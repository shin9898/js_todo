import { TodoListModel } from './model/TodoListModel.js';
import { TodoFormView } from './view/TodoFormView.js';
import { TodoListView } from './view/TodoListView.js';

/**
 * Todoアプリケーションのメインクラス
 * 全コンポーネントの統合と制御を担当
 */
export class App {
    constructor() {
        console.log('🏗️ App初期化開始...');

        // Model初期化
        this.todoListModel = new TodoListModel();
        console.log('✅ TodoListModel初期化完了');

        // DOM要素取得
        this.formElement = document.querySelector('.input-group')?.parentElement;
        this.listElement = document.getElementById('todoItems');
        this.counterElement = document.getElementById('taskCounter');

        if (!this.formElement || !this.listElement || !this.counterElement) {
            throw new Error('必要なDOM要素が見つかりません');
        }
        console.log('✅ DOM要素取得完了');

        // View初期化（小文字に修正）
        this.todoFormView = new TodoFormView(this.formElement);
        this.todoListView = new TodoListView(this.listElement, this.counterElement);
        console.log('✅ View初期化完了');

        // イベント連携
        this.#bindEvents();
        console.log('✅ イベント連携設定完了'); // セミコロン追加

        // 初期表示
        this.#render();
        console.log('✅ 初期表示完了');

        console.log('🚀 Todoアプリケーションが初期化されました');
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
            console.log('🟢 App: ADD イベント受信', event.detail);
            this.#handleAddTodo(event.detail.text);
        });

        // 2. TodoListView → App → TodoListModel（操作系）
        document.addEventListener('todo:toggle', (event) => {
            if (isToggleProcessing) return;
            isToggleProcessing = true;

            console.log('🟢 App: TOGGLE イベント受信', event.detail);
            this.#handleToggleTodo(event.detail.id, event.detail.completed);

            setTimeout(() => { isToggleProcessing = false; }, 50);
        });

        document.addEventListener('todo:update', (event) => {
            if (isUpdateProcessing) return;
            isUpdateProcessing = true;

            console.log('🟢 App: UPDATE イベント受信', event.detail);
            this.#handleUpdateTodo(event.detail.id, event.detail.text);

            setTimeout(() => { isUpdateProcessing = false; }, 50);
        });

        document.addEventListener('todo:delete', (event) => {
            if (isDeleteProcessing) return;
            isDeleteProcessing = true;

            console.log('🟢 App: DELETE イベント受信', event.detail);
            this.#handleDeleteTodo(event.detail.id);

            setTimeout(() => { isDeleteProcessing = false; }, 50);
        });

        // 3. TodoListModel → App → TodoListView（データ変更通知）
        this.todoListModel.on('list:changed', () => {
            console.log('🟢 App: LIST CHANGED');
            this.#render();
        });

        this.todoListModel.on('item:added', (item) => {
            console.log('📝 新しいTodoが追加されました:', item.text);
        });

        this.todoListModel.on('item:deleted', (id) => {
            console.log('🗑️ Todoが削除されました ID:', id);
        });

        this.todoListModel.on('item:updated', (item) => {
            console.log('✏️ Todoが更新されました:', item.text);
        });
    }

    /**
     * View層にModelデータを反映
     */
    #render() {
        const todoItems = this.todoListModel.getAllItems();
        this.todoListView.render(todoItems); // 小文字に修正
    }

    /**
     * Todo追加処理
     * @param {string} text - 追加するTodoのテキスト
     */
    #handleAddTodo(text) {
        try {
            const addedItem = this.todoListModel.addItem(text);
            console.log('➕ Todo追加成功:', addedItem.text);
        } catch (error) {
            console.error('❌ Todo追加失敗:', error.message);
            alert(error.message);
        }
    }

    /**
     * Todo完了状態切り替え処理
     * @param {number} id - TodoのID
     * @param {boolean} completed - 新しい完了状態
     */
    #handleToggleTodo(id, completed) {
        console.log('🟢 App: handleToggleTodo開始', { id, completed }); // デバッグ追加
        const success = this.todoListModel.updateItem(id, { completed });
        if (success) {
            console.log(`🔄 Todo切り替え成功 ID:${id} → ${completed ? '完了' : '未完了'}`);
        } else {
            console.error('❌ Todo切り替え失敗 ID:', id);
        }
    }

    /**
     * Todoテキスト更新処理
     * @param {number} id - TodoのID
     * @param {string} text - 新しいテキスト
     */
    #handleUpdateTodo(id, text) {
        try {
            const success = this.todoListModel.updateItem(id, { text });
            if (success) {
                console.log(`✏️ Todo更新成功 ID:${id} → "${text}"`);
            } else {
                console.error('❌ Todo更新失敗 ID:', id);
            }
        } catch (error) {
            console.error('❌ Todo更新エラー:', error.message);
            alert(error.message);
        }
    }

    /**
     * Todo削除処理
     * @param {number} id - TodoのID
     */
    #handleDeleteTodo(id) {
        const success = this.todoListModel.deleteItem(id);
        if (success) {
            console.log(`🗑️ Todo削除成功 ID:${id}`);
        } else {
            console.error('❌ Todo削除失敗 ID:', id);
        }
    }
}