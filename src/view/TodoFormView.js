/**
 * Todo入力フォームを管理するクラス
 */
export class TodoFormView {
    /**
     * TodoFormViewを作成
     * @param {HTMLElement} formElement - フォーム要素
     */
    constructor(formElement) {
        this.formElement = formElement;
        this.inputElement = formElement.querySelector('#todoInput');
        this.addButton = formElement.querySelector('#addBtn');

        if (!this.inputElement || !this.addButton) {
            throw new Error('Required form elements not found');
        }

        this.#bindEvents();
    }

    /**
     * イベントリスナーを設定
     */
    #bindEvents() {
        this.addButton.addEventListener('click', (event) => {
            event.preventDefault();
            this.#handleSubmit();
        });

        this.inputElement.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                this.#handleSubmit();
            }
        });
    }

    /**
     * フォーム送信処理
     */
    #handleSubmit() {
        const text = this.inputElement.value.trim();

        if (text) {
            const addEvent = new CustomEvent('todo:add', {
                detail: { text }
            });
            this.formElement.dispatchEvent(addEvent);
            this.#clearInput();
        } else {
            this.#showError('Todoを入力してください');
        }
    }

    /**
     * 入力欄をクリア
     */
    #clearInput() {
        this.inputElement.value = '';
        this.inputElement.focus();
    }

    /**
     * エラーメッセージ表示
     * @param {string} message - エラーメッセージ
     */
    #showError(message) {
        alert(message); // 一時的な実装
    }
}