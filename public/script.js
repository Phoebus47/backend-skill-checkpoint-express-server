const API_BASE_URL = window.location.origin;

// DOM Elements
const questionForm = document.getElementById("questionForm");
const answerForm = document.getElementById("answerForm");
const questionsList = document.getElementById("questionsList");
const questionModal = document.getElementById("questionModal");
const questionDetail = document.getElementById("questionDetail");
const answersList = document.getElementById("answersList");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const clearBtn = document.getElementById("clearBtn");
const closeModal = document.querySelector(".close");
const charCount = document.getElementById("charCount");
const answerContent = document.getElementById("answerContent");

let currentQuestionId = null;

// Load questions on page load
document.addEventListener("DOMContentLoaded", loadQuestions);

// Event Listeners
questionForm.addEventListener("submit", handleQuestionSubmit);
answerForm.addEventListener("submit", handleAnswerSubmit);
searchBtn.addEventListener("click", handleSearch);
clearBtn.addEventListener("click", loadQuestions);
closeModal.addEventListener("click", closeQuestionModal);
answerContent.addEventListener("input", updateCharCount);

// Close modal when clicking outside
window.addEventListener("click", (e) => {
  if (e.target === questionModal) {
    closeQuestionModal();
  }
});

// Handle question form submission
async function handleQuestionSubmit(e) {
  e.preventDefault();

  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();
  const category = document.getElementById("category").value;

  if (!title || !description || !category) {
    showMessage("Please fill in all fields", "error");
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/questions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, description, category }),
    });

    const data = await response.json();

    if (response.ok) {
      showMessage("Question posted successfully!", "success");
      questionForm.reset();
      loadQuestions();
    } else {
      showMessage(data.message || "Error posting question", "error");
    }
  } catch (error) {
    console.error("Error:", error);
    showMessage("Network error. Please check your connection.", "error");
  }
}

// Handle answer form submission
async function handleAnswerSubmit(e) {
  e.preventDefault();

  const content = answerContent.value.trim();

  if (!content) {
    showMessage("Please enter your answer", "error");
    return;
  }

  if (content.length > 300) {
    showMessage("Answer must be 300 characters or less", "error");
    return;
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/questions/${currentQuestionId}/answers`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      }
    );

    const data = await response.json();

    if (response.ok) {
      showMessage("Answer submitted successfully!", "success");
      answerForm.reset();
      updateCharCount();
      loadAnswers(currentQuestionId);
    } else {
      showMessage(data.message || "Error submitting answer", "error");
    }
  } catch (error) {
    console.error("Error:", error);
    showMessage("Network error. Please check your connection.", "error");
  }
}

// Load and display questions
async function loadQuestions() {
  try {
    questionsList.innerHTML = '<div class="loading">Loading questions...</div>';

    const response = await fetch(`${API_BASE_URL}/questions`);
    const data = await response.json();

    if (response.ok && data.data && data.data.length > 0) {
      displayQuestions(data.data);
    } else {
      questionsList.innerHTML =
        '<div class="loading">No questions yet. Be the first to ask!</div>';
    }
  } catch (error) {
    console.error("Error:", error);
    questionsList.innerHTML =
      '<div class="loading error">Error loading questions. Please refresh the page.</div>';
  }
}

// Display questions
function displayQuestions(questions) {
  questionsList.innerHTML = questions
    .map(
      (question) => `
        <div class="question-item" onclick="openQuestionDetail(${question.id})">
            <div class="question-title">${escapeHtml(question.title)}</div>
            <div class="question-description">${escapeHtml(
              question.description
            )}</div>
            <div class="question-meta">
                <span class="question-category">${escapeHtml(
                  question.category
                )}</span>
                <span>Created: ${new Date(
                  question.created_at
                ).toLocaleDateString()}</span>
            </div>
        </div>
    `
    )
    .join("");
}

// Open question detail modal
async function openQuestionDetail(questionId) {
  currentQuestionId = questionId;

  try {
    // Load question details
    const questionResponse = await fetch(
      `${API_BASE_URL}/questions/${questionId}`
    );
    const questionData = await questionResponse.json();

    if (questionResponse.ok) {
      displayQuestionDetail(questionData.data);
      loadAnswers(questionId);
      questionModal.style.display = "block";
    } else {
      showMessage("Error loading question details", "error");
    }
  } catch (error) {
    console.error("Error:", error);
    showMessage("Network error loading question", "error");
  }
}

// Display question detail
function displayQuestionDetail(question) {
  questionDetail.innerHTML = `
        <h2>${escapeHtml(question.title)}</h2>
        <p class="question-description">${escapeHtml(question.description)}</p>
        <div class="question-meta">
            <span class="question-category">${escapeHtml(
              question.category
            )}</span>
            <span>Created: ${new Date(
              question.created_at
            ).toLocaleDateString()}</span>
        </div>
        <hr style="margin: 20px 0;">
    `;
}

// Load answers for a question
async function loadAnswers(questionId) {
  try {
    answersList.innerHTML = '<div class="loading">Loading answers...</div>';

    const response = await fetch(
      `${API_BASE_URL}/questions/${questionId}/answers`
    );
    const data = await response.json();

    if (response.ok) {
      if (data.data && data.data.length > 0) {
        displayAnswers(data.data);
      } else {
        answersList.innerHTML =
          '<div class="loading">No answers yet. Be the first to answer!</div>';
      }
    } else {
      answersList.innerHTML =
        '<div class="loading error">Error loading answers</div>';
    }
  } catch (error) {
    console.error("Error:", error);
    answersList.innerHTML =
      '<div class="loading error">Network error loading answers</div>';
  }
}

// Display answers
function displayAnswers(answers) {
  answersList.innerHTML = `
        <h3>Answers (${answers.length})</h3>
        ${answers
          .map(
            (answer) => `
            <div class="answer-item">
                <div class="answer-content">${escapeHtml(answer.content)}</div>
                <div class="answer-meta">
                    Answered on ${new Date(
                      answer.created_at
                    ).toLocaleDateString()}
                </div>
            </div>
        `
          )
          .join("")}
    `;
}

// Handle search
async function handleSearch() {
  const query = searchInput.value.trim();

  if (!query) {
    showMessage("Please enter a search term", "error");
    return;
  }

  try {
    questionsList.innerHTML = '<div class="loading">Searching...</div>';

    const response = await fetch(
      `${API_BASE_URL}/questions/search?title=${encodeURIComponent(
        query
      )}&category=${encodeURIComponent(query)}`
    );
    const data = await response.json();

    if (response.ok && data.data && data.data.length > 0) {
      displayQuestions(data.data);
    } else {
      questionsList.innerHTML =
        '<div class="loading">No questions found matching your search.</div>';
    }
  } catch (error) {
    console.error("Error:", error);
    questionsList.innerHTML =
      '<div class="loading error">Error searching questions</div>';
  }
}

// Close question modal
function closeQuestionModal() {
  questionModal.style.display = "none";
  currentQuestionId = null;
  answerForm.reset();
  updateCharCount();
}

// Update character count
function updateCharCount() {
  const count = answerContent.value.length;
  charCount.textContent = count;

  if (count > 300) {
    charCount.style.color = "red";
  } else if (count > 250) {
    charCount.style.color = "orange";
  } else {
    charCount.style.color = "#666";
  }
}

// Show message to user
function showMessage(message, type) {
  // Remove existing messages
  const existingMessages = document.querySelectorAll(".message");
  existingMessages.forEach((msg) => msg.remove());

  const messageDiv = document.createElement("div");
  messageDiv.className = `message ${type}`;
  messageDiv.textContent = message;

  document
    .querySelector(".container")
    .insertBefore(messageDiv, document.querySelector("main"));

  // Auto remove after 5 seconds
  setTimeout(() => {
    messageDiv.remove();
  }, 5000);
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  // เพิ่มการตรวจสอบ null/undefined
  if (!text || typeof text !== "string") {
    return "";
  }

  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}
