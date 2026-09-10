/* =================================
   SCHOLARSHIPS PAGE
================================= */


/* =================================
   SCHOLARSHIP DATA
================================= */

const scholarships = [

  {
    id: 1,

    title: "MTN Foundation Scholarship",

    description:
      "A scholarship opportunity supporting high-performing Nigerian students in tertiary institutions.",

    type: "Undergraduate",

    location: "Nigeria",

    field: "All Fields",

    deadline: "2026-10-31",

    provider: "MTN Foundation"
  },


  {
    id: 2,

    title: "Agbami Medical and Engineering Scholarship",

    description:
      "Financial support for Nigerian undergraduate students studying medicine, engineering and related disciplines.",

    type: "Undergraduate",

    location: "Nigeria",

    field: "Engineering",

    deadline: "2026-09-30",

    provider: "Agbami"
  },


  {
    id: 3,

    title: "Federal Government Scholarship",

    description:
      "A scholarship opportunity for eligible Nigerian students pursuing undergraduate and postgraduate studies.",

    type: "Undergraduate",

    location: "Nigeria",

    field: "All Fields",

    deadline: "2026-11-15",

    provider: "Federal Government"
  },


  {
    id: 4,

    title: "Mastercard Foundation Scholars Program",

    description:
      "A major scholarship program supporting talented students with academic potential and leadership aspirations.",

    type: "Undergraduate",

    location: "International",

    field: "All Fields",

    deadline: "2026-12-01",

    provider: "Mastercard Foundation"
  },


  {
    id: 5,

    title: "Chevening Scholarship",

    description:
      "A fully funded opportunity for students seeking to pursue postgraduate study in the United Kingdom.",

    type: "Postgraduate",

    location: "United Kingdom",

    field: "All Fields",

    deadline: "2026-11-05",

    provider: "Chevening"
  },


  {
    id: 6,

    title: "Commonwealth Scholarship",

    description:
      "Funding opportunity for talented students from eligible Commonwealth countries to study abroad.",

    type: "Postgraduate",

    location: "International",

    field: "All Fields",

    deadline: "2026-10-20",

    provider: "Commonwealth"
  },


  {
    id: 7,

    title: "Google Africa Scholarship",

    description:
      "An opportunity designed to help African students develop valuable technology and digital skills.",

    type: "Training",

    location: "Africa",

    field: "Technology",

    deadline: "2026-10-15",

    provider: "Google"
  },


  {
    id: 8,

    title: "Shell Nigeria Scholarship",

    description:
      "Scholarship support for qualified Nigerian students pursuing tertiary education.",

    type: "Undergraduate",

    location: "Nigeria",

    field: "Engineering",

    deadline: "2026-09-25",

    provider: "Shell Nigeria"
  }

];


/* =================================
   ELEMENTS
================================= */

const scholarshipGrid =
  document.querySelector(".scholarship-grid");

const scholarshipSearch =
  document.querySelector(
    ".scholarship-search-input input"
  );

const scholarshipSearchForm =
  document.querySelector(".scholarship-search");

const searchButton =
  scholarshipSearchForm?.querySelector("button");

const filterSelects =
  document.querySelectorAll(
    ".scholarship-filters select"
  );

const resetFilters =
  document.querySelector(
    ".filters-header button"
  );

const sortScholarships =
  document.getElementById(
    "sort-scholarships"
  );

const loadMoreButton =
  document.getElementById("load-more");

const emptyState =
  document.querySelector(".scholarship-empty");


/* =================================
   STATE
================================= */

let filteredScholarships = [
  ...scholarships
];

let displayedCount = 6;

const scholarshipsPerLoad = 4;


/* =================================
   FORMAT DATE
================================= */

function formatDate(dateString) {

  const date = new Date(dateString);

  return date.toLocaleDateString(
    "en-NG",
    {
      day: "numeric",
      month: "short",
      year: "numeric"
    }
  );

}


/* =================================
   CHECK DEADLINE
================================= */

function getDeadlineStatus(dateString) {

  const today = new Date();

  const deadline = new Date(dateString);

  today.setHours(0, 0, 0, 0);

  deadline.setHours(0, 0, 0, 0);


  if (deadline < today) {

    return "Closed";

  }


  return formatDate(dateString);

}


/* =================================
   CREATE SCHOLARSHIP CARD
================================= */

function createScholarshipCard(
  scholarship
) {

  const card =
    document.createElement("article");

  card.className =
    "scholarship-card";


  card.innerHTML = `

    <div class="scholarship-card-top">

      <div class="scholarship-card-logo">
        ${getInitials(scholarship.provider)}
      </div>

      <span class="scholarship-card-type">
        ${scholarship.type}
      </span>

    </div>


    <div class="scholarship-card-content">

      <h3>
        ${scholarship.title}
      </h3>

      <p class="scholarship-card-description">
        ${scholarship.description}
      </p>

    </div>


    <div class="scholarship-card-meta">

      <span class="scholarship-meta-item">
        📍 ${scholarship.location}
      </span>

      <span class="scholarship-meta-item">
        🎓 ${scholarship.field}
      </span>

    </div>


    <div class="scholarship-card-bottom">

      <div class="scholarship-deadline">

        Deadline

        <strong>
          ${getDeadlineStatus(
            scholarship.deadline
          )}
        </strong>

      </div>


      <a
        href="scholarship-details.html?id=${scholarship.id}"
        class="scholarship-view">

        View Opportunity

      </a>

    </div>

  `;


  return card;

}


/* =================================
   GET PROVIDER INITIALS
================================= */

function getInitials(name) {

  if (!name) return "?";


  const words =
    name.trim().split(/\s+/);


  if (words.length === 1) {

    return words[0]
      .substring(0, 2)
      .toUpperCase();

  }


  return (
    words[0][0] +
    words[1][0]
  ).toUpperCase();

}


/* =================================
   DISPLAY SCHOLARSHIPS
================================= */

function displayScholarships() {

  if (!scholarshipGrid) return;


  scholarshipGrid.innerHTML = "";


  const scholarshipsToShow =
    filteredScholarships.slice(
      0,
      displayedCount
    );


  if (
    scholarshipsToShow.length === 0
  ) {

    if (emptyState) {

      emptyState.hidden = false;

    }

    updateLoadMoreButton();

    return;

  }


  if (emptyState) {

    emptyState.hidden = true;

  }


  scholarshipsToShow.forEach(
    function (scholarship) {

      const card =
        createScholarshipCard(
          scholarship
        );

      scholarshipGrid.appendChild(card);

    }
  );


  updateLoadMoreButton();

}


/* =================================
   UPDATE LOAD MORE BUTTON
================================= */

function updateLoadMoreButton() {

  if (!loadMoreButton) return;


  if (
    filteredScholarships.length >
    displayedCount
  ) {

    loadMoreButton.hidden = false;

  } else {

    loadMoreButton.hidden = true;

  }

}


/* =================================
   FILTER SCHOLARSHIPS
================================= */

function filterScholarships() {

  const searchTerm =
    scholarshipSearch
      ? scholarshipSearch.value
          .trim()
          .toLowerCase()
      : "";


  /*
    Get filter values.
    The order assumes:

    1. Study level
    2. Location
    3. Field
  */

  const studyLevel =
    filterSelects[0]
      ? filterSelects[0].value
      : "all";


  const location =
    filterSelects[1]
      ? filterSelects[1].value
      : "all";


  const field =
    filterSelects[2]
      ? filterSelects[2].value
      : "all";


  filteredScholarships =
    scholarships.filter(
      function (scholarship) {

        const matchesSearch =
          !searchTerm ||

          scholarship.title
            .toLowerCase()
            .includes(searchTerm) ||

          scholarship.description
            .toLowerCase()
            .includes(searchTerm) ||

          scholarship.provider
            .toLowerCase()
            .includes(searchTerm) ||

          scholarship.field
            .toLowerCase()
            .includes(searchTerm);


        const matchesStudyLevel =
          studyLevel === "all" ||
          scholarship.type === studyLevel;


        const matchesLocation =
          location === "all" ||
          scholarship.location === location;


        const matchesField =
          field === "all" ||
          scholarship.field === field;


        return (
          matchesSearch &&
          matchesStudyLevel &&
          matchesLocation &&
          matchesField
        );

      }
    );


  displayedCount = 6;


  sortResults();


  displayScholarships();

}


/* =================================
   SORT SCHOLARSHIPS
================================= */

function sortResults() {

  if (!sortScholarships) return;


  const sortValue =
    sortScholarships.value;


  if (sortValue === "deadline") {

    filteredScholarships.sort(
      function (a, b) {

        return new Date(a.deadline) -
          new Date(b.deadline);

      }
    );

  }


  else if (sortValue === "newest") {

    filteredScholarships.sort(
      function (a, b) {

        return b.id - a.id;

      }
    );

  }


  else if (sortValue === "oldest") {

    filteredScholarships.sort(
      function (a, b) {

        return a.id - b.id;

      }
    );

  }

}


/* =================================
   SEARCH
================================= */

if (scholarshipSearchForm) {

  scholarshipSearchForm.addEventListener(
    "submit",
    function (event) {

      event.preventDefault();

      filterScholarships();

    }
  );

}


/* =================================
   LIVE SEARCH
================================= */

if (scholarshipSearch) {

  scholarshipSearch.addEventListener(
    "input",
    function () {

      filterScholarships();

    }
  );

}


/* =================================
   FILTER EVENTS
================================= */

filterSelects.forEach(
  function (select) {

    select.addEventListener(
      "change",
      function () {

        filterScholarships();

      }
    );

  }
);


/* =================================
   SORT EVENT
================================= */

if (sortScholarships) {

  sortScholarships.addEventListener(
    "change",
    function () {

      sortResults();

      displayScholarships();

    }
  );

}


/* =================================
   RESET FILTERS
================================= */

if (resetFilters) {

  resetFilters.addEventListener(
    "click",
    function () {

      if (scholarshipSearch) {

        scholarshipSearch.value = "";

      }


      filterSelects.forEach(
        function (select) {

          select.selectedIndex = 0;

        }
      );


      if (sortScholarships) {

        sortScholarships.selectedIndex = 0;

      }


      filteredScholarships =
        [...scholarships];


      displayedCount = 6;


      displayScholarships();

    }
  );

}


/* =================================
   LOAD MORE
================================= */

if (loadMoreButton) {

  loadMoreButton.addEventListener(
    "click",
    function () {

      displayedCount +=
        scholarshipsPerLoad;

      displayScholarships();

    }
  );

}


/* =================================
   INITIALIZE PAGE
================================= */

displayScholarships();