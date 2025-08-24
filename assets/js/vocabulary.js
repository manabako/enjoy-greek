// URLパラメータからJSONファイル名を取得する関数
function getJsonFileName() {
    const params = new URLSearchParams(window.location.search);
    return params.get("data") || "words"; // デフォルトをgreek.jsonに
}

let wordData = []; // JSON全体を保持
let correctAnswer = null; // 正解の意味
let isAnswerIncluded = true; // 今回の問題で正解が含まれるかどうか
let totalQuestions = 0;      // 出題済みの問題数
let correctQuestions = 0;    // 正解数

document.addEventListener("DOMContentLoaded", async () => {
    try {
        // JSONデータを取得
        const jsonFile = getJsonFileName(); // URLパラメータから取得
        const response = await fetch(`../../assets/json/${jsonFile}.json`);
        wordData = await response.json();

        setNewQuestion();
    } catch (error) {
        console.error("JSON読み込みエラー:", error);
    }
});

function updateScore() {
    const scoreDiv = document.querySelector(".score");
    scoreDiv.textContent = `第${totalQuestions}問 (${correctQuestions}問正解)`;
}

function setNewQuestion() {
    totalQuestions++; // 出題数を増やす
    updateScore();

    // ランダムに1つ選択
    const randomIndex = Math.floor(Math.random() * wordData.length);
    const questionItem = wordData[randomIndex];

    // meaningリストから1つランダムに選ぶ
    const meanings = questionItem.meaning;
    correctAnswer = meanings[Math.floor(Math.random() * meanings.length)];

    // 問題文に lemma を表示
    document.querySelector(".question").textContent = questionItem.lemma;

    // 今回、正解を含めるかどうかをランダムに決定（30%の確率で含まれない）
    isAnswerIncluded = Math.random() < 0.3;

    let options = [];
    if (isAnswerIncluded) {
        // 正解を含める場合
        options.push(correctAnswer);
    }

    // 不正解を4つになるまでランダムに追加
    while (options.length < 4) {
        const randItem = wordData[Math.floor(Math.random() * wordData.length)];
        const randMeaning = randItem.meaning[Math.floor(Math.random() * randItem.meaning.length)];
        if (!options.includes(randMeaning) && !meanings.includes(randMeaning)) {
            options.push(randMeaning);
        }
    }


    // 選択肢をランダムに並び替え（シャッフル）
    options = options.sort(() => Math.random() - 0.5);

    // ボタンにテキストをセット（最初の4つだけ）
    const buttons = document.querySelectorAll(".answers button");
    buttons.forEach((btn, i) => {
        if (i < 4) {
            btn.textContent = options[i];
            btn.onclick = () => checkAnswer(options[i]);
        } else {
            // 5番目は「この中にない」
            btn.textContent = "この中にない";
            btn.onclick = () => checkNoneButton();
        }
    });
}


function checkAnswer(selected) {
    if (!isAnswerIncluded) {
        alert(`不正解！ 今回の正解は選択肢にありませんでした。\n正解: ${correctAnswer}`);
    } else if (selected === correctAnswer) {
        alert("正解！");
        correctQuestions++;
    } else {
        alert(`不正解！ 正解は「${correctAnswer}」でした。`);
    }
    setNewQuestion();
}

function checkNoneButton() {
    if (isAnswerIncluded) {
        alert(`不正解！ 正解は「${correctAnswer}」でした。`);
    } else {
        alert("正解！（正解は選択肢にありませんでした）");
        correctQuestions++;
    }
    setNewQuestion();
}