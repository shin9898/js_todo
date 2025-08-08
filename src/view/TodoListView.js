import { TodoItemView } from './TodoItemView.js';

/**
 * Todo一覧の表示を管理するクラス
 */
export class TodoListView {
    /**
     * TodoListViewを作成
     * @param {HTMLElement} listElement - Todo一覧のul要素（#todoItems）
     * @param {HTMLElement} counterElement - カウンター表示のdiv要素（#taskCounter）
     */
    constructor(listElement, counterElement) {
        this.listElement = listElement;
        this.counterElement = counterElement;
        this.todoItemViews = new Map();

        this.#bindEvents();
    }

    /**
     * Todo一覧を描画
     * @param {TodoItemModel[]} todoItems - 表示するTodoアイテムの配列
     */
    render(todoItems) {
        this.#clearViews();

        todoItems.forEach(todoItem => {
            const todoItemView = new TodoItemView(todoItem);
            this.todoItemViews.set(todoItem.id, todoItemView);
            this.listElement.appendChild(todoItemView.element);
        });

        this.#updateCounter(todoItems);
    }

    /**
     * カウンター表示を更新
     * @param {TodoItemModel[]} todoItems - 表示するTodoアイテムの配列
     */
    #updateCounter(todoItems) {
        if (todoItems.length === 0) {
        // タスクが0件の場合の表示
        this.counterElement.innerHTML = `
            <div class="card-body text-center">
                <h6 class="text-muted mb-0">タスクがありません</h6>
                <small class="text-muted">新しいタスクを追加してください</small>
            </div>
        `;
        return;
    }

        // 通常のカウンター表示
        const total = todoItems.length;
        const completed = todoItems.filter(item => item.completed).length;
        const incomplete = total - completed;

        this.counterElement.innerHTML = `
        <div class="card-body">
            <h6 class="card-title text-center mb-3">タスクの状況</h6>
            <div class="row text-center">
                <div class="col-4">
                    <h4 class="text-primary mb-1">${total}</h4>
                    <small class="text-muted">全てのタスク</small>
                </div>
                <div class="col-4">
                    <h4 class="text-success mb-1">${completed}</h4>
                    <small class="text-muted">完了済み</small>
                </div>
                <div class="col-4">
                    <h4 class="text-warning mb-1">${incomplete}</h4>
                    <small class="text-muted">未完了</small>
                </div>
            </div>
        </div>
    `;
    }

    /**
     * 既存のViewをクリア
     */
    #clearViews() {
        this.todoItemViews.clear();
        this.listElement.innerHTML = '';
    }

    /**
     * イベントリスナーを設定
     */
    #bindEvents() {
        this.listElement.addEventListener('todo:toggle', (event) => {
            this.#forwardEvent('todo:toggle', event.detail);
        });

        this.listElement.addEventListener('todo:delete', (event) => {
            this.#forwardEvent('todo:delete', event.detail);
        });

        this.listElement.addEventListener('todo:update', (event) => {
            this.#forwardEvent('todo:update', event.detail);
        });
    }

    /**
     * イベントをApp.jsに転送
     * @param {string} eventName - イベント名
     * @param {Object} detail - イベントの詳細データ
     */
    #forwardEvent(eventName, detail) {
        const forwardedEvent = new CustomEvent(eventName, {
            detail,
            bubbles: true
        });
        document.dispatchEvent(forwardedEvent);
    }

}