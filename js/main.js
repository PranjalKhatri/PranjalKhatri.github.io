async function fetchnews() {
  const newspro = await fetch(
    "https://coding-week-2024-api.onrender.com/api/data"
  );
  const newsdata = await newspro.json();
  return newsdata;
}

let index = 0;
function writeText(id, text) {
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      document.getElementById(id).textContent += text[index];
      index++;
      if (index >= text.length) {
        clearInterval(interval);
        resolve();
      }
    }, 70); // Adjust the delay as needed
  });
}
//our news variable , contains some dummy news to show before fetching the actual news
let news = [
  {
    headline: "Local coming back on street again after",
    fullnews:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor architecto numquam doloremque velit vero consequuntur, quo non quia nulla nisi ducimus nemo vel, voluptate quae eos, sint blanditiis illum illo.",
  },
  {
    headline: "New Study Reveals Surprising Benefits of Daily Meditation",
    fullnews:
      "A groundbreaking study published in the Journal of Mindfulness has shed light on the remarkable benefits of integrating daily meditation into our routines. Researchers found that just 15 minutes of meditation each day can significantly reduce stress levels, enhance cognitive function, and promote overall well-being",
  },
];
// Function to run the effect showing news headlines letter by letter
async function runEffect(id, curindex) {
  // Check if current index is valid
  if (curindex >= news.length) {
    curindex = 0;
  }

  // Clear text content of target element
  document.getElementById(id).textContent = "";

  // Write text with delay
  await writeText(id, news[curindex].headline + "...");
  index = 0; // Reset index after writing text

  // Wait for one second before displaying the next news
  setTimeout(() => {
    runEffect(id, curindex + 1); // Call runEffect with next index
  }, 3000); // Delay of one second (1000 milliseconds)
}

function shownews(news_content, headline, author, date) {
  const newscontainer = document.querySelector(".news-container");
  newscontainer.innerHTML = `
  <h1 class="ncheadline">${headline}</h1>
      <div class="author-date">
        <p class="author">${author}</p>
        <p class="date">${date}</p>
      </div>
      <p class="news-content">${news_content}</p>
      <button class="exit" onclick="disablenews()">Back</button>
  `;
  newscontainer.style.display = "block";
}
function updateBanners(
  data,
  bannertype = "largebanner",
  index = 0,
  childindex = 0
) {
  const banner = document.getElementsByClassName(bannertype)[childindex];

  const newslink = document.querySelectorAll(`.${bannertype} > a`)[childindex];

  const category = document.querySelectorAll(
    `.${bannertype} .categories a:nth-child(1)`
  )[childindex];

  const bannernewstext = document.querySelectorAll(
    `.${bannertype} .bannernewstext `
  )[childindex];

  const src_dat = document.querySelectorAll(`.${bannertype} .srcdat `)[
    childindex
  ];

  const formattedDate = new Date(data[index].date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  newslink.setAttribute(
    "onclick",
    `shownews('${data[index].content}','${data[index].headline}','${data[index].author}','${formattedDate}')`
  );
  src_dat.innerHTML = `
          <img src="./images/Pricing plans _ Freepik.jpg" class="circleimage icon">
          ${data[index].author}
          <img src="./images/calendar.svg" alt="weather" class="icon">${formattedDate}
        `;

  console.log(src_dat);
  console.log(category);
  banner.setAttribute("style", `background-image: url(${data[index].image})`);
  bannernewstext.textContent = data[index].headline;
  category.textContent = data[index].type;
}

function updatelistnews(data, numarray = []) {
  if (numarray.length < 4) {
    numarray = Array.from({ length: data.length }, (_, index) => index);
  }
  const listbanners = document.querySelector(".listbanners");
  listbanners.innerHTML = `<ul class="nav_links">
  <li><a href="#">LATEST</a></li>
  <li id="current"><a href="#">POPULAR</a></li>
</ul>`;
  for (let i = 4; i < data.length; i++) {
    const formattedDate = new Date(data[numarray[i]].date).toLocaleDateString(
      "en-US",
      {
        month: "long",
        day: "numeric",
        year: "numeric",
      }
    );
    const listBannerElem = document.createElement("div");
    listBannerElem.classList.add("listbannerelem");
    listBannerElem.innerHTML = `
    <a href="#" onclick =  "shownews('${data[numarray[i]].content}','${
      data[numarray[i]].headline
    }','${data[numarray[i]].author}','${formattedDate}')">
      <img src="${data[numarray[i]].image}" alt="" srcset="" />
      <p>${data[numarray[i]].headline}</p>
      <br />
      <div class="date">
       <img src="./images/calendar.svg" alt="weather" class="icon" />
       ${formattedDate}
      </div>
    </a>
   `;
    listbanners.appendChild(listBannerElem);
    /*
   <div class="listbannerelem">
            <a href="#">
          <img
            src="./images/Union-home-minister-Amit-Shah.avif"
            alt=""
            srcset=""
          />
          <p>Amit Shah to visit J&K to review security situation..</p>
          <br /><!-- Amit Shah to visit J&K to review security situation.. -->
          <div class="date">
            <img src="./images/calendar.svg" alt="weather" class="icon" />
            June 18, 2024
          </div>
          </a>
        </div>*/
  }
}
// only access elements after the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {
  /* Get the current date */
  const currentDate = new Date();
  const month = currentDate.toLocaleString("default", { month: "long" });
  const date = currentDate.getDate();
  const year = currentDate.getFullYear();

  document
    .getElementById("date")
    .insertAdjacentHTML("beforeend", `${month} ${date}, ${year}`);

  fetchnews()
    .then((data) => {
      console.log(data);
      news = data;
      //run the effect
      runEffect("Headline", 0);
      const randomArray = Array.from(
        { length: data.length },
        (_, index) => index
      );
      randomArray.sort(() => Math.random() - 0.5);
      console.log(randomArray);
      //update the large , medium and small news banners
      updateBanners(data, "largebanner", randomArray[0]);
      updateBanners(data, "mediumbanner", randomArray[1]);
      updateBanners(data, "smallbanner", randomArray[2]);
      updateBanners(data, "smallbanner", randomArray[3], 1);
      updatelistnews(data, randomArray);
    })
    .catch((err) => {
      console.log(err);
    });
});
