/**
 * 個別のTodoアイテムを表示・操作するクラス
 */
export class TodoItemView {
    /**
     * TodoItemViewを作成
     * @param {TodoItemModel} todoItem - 表示するTodoアイテム
     */
    constructor(todoItem) {
        this.todoItem = todoItem;
        this.element = this.#createElement();
        this.isEditing = false;

        this.#bindEvents();
    }

    /**
     * TodoアイテムのDOM要素を作成
     * @returns {HTMLElement} - 作成されたli要素
     */
    #createElement() {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';
        li.dataset.todoId = this.todoItem.id;

        // innerHTML を直接設定（this.elementを使わない）
        li.innerHTML = this.#createViewingHTML();

        return li;
    }

    /**
     * 要素の内容を更新(表示モード vs 編集モード)
     */
    updateElement() {
        if (this.isEditing) {
            this.element.innerHTML = this.#createEditingHTML();
        } else {
            this.element.innerHTML = this.#createViewingHTML();
        }
    }


    /**
     * 表示モードのHTML生成
     * @returns {string} - HTML文字列
     */
    #createViewingHTML() {
        const checkedAttr = this.todoItem.completed ? 'checked' : '';
        const textClass = this.todoItem.completed ? 'text-decoration-line-through text-muted' : '';

        return `
            <div class="form-check d-flex align-items-center">
                <input class="form-check-input me-2" type="checkbox" ${checkedAttr} data-action="toggle">
                <span class="${textClass}" data-action="text">${this.todoItem.text}</span>
            </div>
            <div>
                <button class="btn btn-outline-secondary btn-sm me-1" data-action="edit">編集</button>
                <button class="btn btn-outline-danger btn-sm" data-action="delete">削除</button>
            </div>
        `;
    }

    /**
     * 編集モードのHTML生成
     * @returns {string} - HTML文字列
     */
    #createEditingHTML() {
        const checkedAttr = this.todoItem.completed ? 'checked' : '';

        return `
            <div class="form-check d-flex align-items-center flex-grow-1">
                <input class="form-check-input me-2" type="checkbox" ${checkedAttr} data-action="toggle">
                <input type="text" class="form-control me-2" value="${this.todoItem.text}" data-action="edit-input">
            </div>
            <div>
                <button class="btn btn-outline-success btn-sm me-1" data-action="save">保存</button>
                <button class="btn btn-outline-secondary btn-sm" data-action="cancel">キャンセル</button>
            </div>
        `;
    }

    /**
     * イベントリスナーを設定
     */
    #bindEvents() {
        this.element.addEventListener('click', (event) => {
            const action = event.target.dataset.action;

            switch (action) {
                case 'toggle':
                    this.#handleToggle();
                    break;
                case 'edit':
                    this.#handleEdit();
                    break;
                case 'delete':
                    this.#handleDelete();
                    break;
                case 'save':
                    this.#handleSave();
                    break;
                case 'cancel':
                    this.#handleCancel();
                    break;
            }
        });
    }
    /**
     * チェックボックス切り替え処理
     */
    #handleToggle() {
        console.log('🔵 TodoItemView: handleToggle呼び出し', this.todoItem.id);
        console.log('🔵 TodoItemView: element確認', this.element, this.element.parentElement);

        const toggleEvent = new CustomEvent('todo:toggle', {
            detail: {
                id: this.todoItem.id,
                completed: !this.todoItem.completed
            },
            bubbles: true,
            cancelable: true
        });

        this.element.dispatchEvent(toggleEvent);
        console.log('🔵 TodoItemView: イベント発火完了', toggleEvent.detail);
    }

    /**
     * 編集モード切り替え処理
     */
    #handleEdit() {
        this.isEditing = true;
        this.updateElement();

        const editInput = this.element.querySelector('[data-action="edit-input"]');
        if (editInput) {
            editInput.focus();
            editInput.select();
        }
    }

    /**
     * 削除処理
     */
    #handleDelete() {
        const confirmed = confirm('本当に削除してもよろしいですか？');

        if (confirmed) {
            const deleteEvent = new CustomEvent('todo:delete', {
                detail: { id: this.todoItem.id },
                bubbles: true,
                cancelable: true
            });
            this.element.dispatchEvent(deleteEvent);
        }
    }

    /**
     * 保存処理
     */
    #handleSave() {
        const editInput = this.element.querySelector('[data-action="edit-input"]');
        const newText = editInput.value.trim();

        console.log('🔵 編集保存: 取得したテキスト', newText, typeof newText);

        if (newText) {
            const updateEvent = new CustomEvent('todo:update', {
                detail: {
                    id: this.todoItem.id,
                    text: newText
                },
                bubbles: true,
                cancelable: true
            });
            console.log('🔵 編集保存: イベント詳細', updateEvent.detail);

            this.element.dispatchEvent(updateEvent);

            this.isEditing = false;
            this.updateElement();
        } else {
            alert('Todoを入力してください');
            editInput.focus();
        }
    }

    /**
     * キャンセル処理
     */
    #handleCancel() {
        this.isEditing = false;
        this.updateElement();
    }
}