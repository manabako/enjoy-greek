document.addEventListener("DOMContentLoaded", async () => {
    const container = document.getElementById("card-container");

    // 確認ボタンの読み込み
    try {
        const response = await fetch('../../assets/htmlparts/grammar-ok-check.html');

        if (!response.ok) {
            throw new Error(`HTTPエラー: ${response.status}`);
        }

        checkOkHtml = await response.text();
    } catch (error) {
        console.error("HTMLパーツの読み込みに失敗しました:", error);
    }

    // 読み込みたいMarkdownファイルのパス
    const file = "../../assets/md/001.md";

    try {
        const response = await fetch(file);
        if (!response.ok) throw new Error(`Failed to load ${file}`);
        const markdownText = await response.text();

        // md内のcardを分割
        const sections = markdownText.split(/^##\s+/m).slice(1); // ## で分割
        
        // section毎に処理
        sections.forEach(section => {
            // markedライブラリでMarkdownをHTMLに変換
            const htmlContent = marked.parse(`## ${section}`);

            // divで囲み，確認ボタンを追加
            const wrapped = `<div class="card">${htmlContent}${checkOkHtml}</div>`;

            // DOMに挿入
            container.insertAdjacentHTML('beforeend', wrapped);

        });

        // 変換後のHTML内にあるすべての<table>を探してラップ
        container.querySelectorAll("table").forEach(table => {
            const wrapper = document.createElement("div");
            wrapper.classList.add("table-container");
            table.parentNode.insertBefore(wrapper, table);
            wrapper.appendChild(table);
        });
    } catch (error) {
        console.error(error);
        container.textContent = "読み込みエラーが発生しました。";
    }
});