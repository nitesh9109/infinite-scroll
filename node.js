(function () {
  let quoteTag = document.querySelector(".quotes");
  let loader = document.querySelector(".loader");
  let currentPage = 1;
  const pageLimit = 10;
  let total = 0;

  async function getQuotes(page, limit) {
    let URL = `https://api.javascripttutorial.net/v1/quotes/?page=${page}&limit=${limit}`;
    let response = await fetch(URL);

    if (!response.ok) {
      throw new Error(`An error occured ${response.status}`);
    }

    return await response.json();
  }

  function showQuotes(quotes) {
    quotes.forEach((quote) => {
      const quote1 = document.createElement("blockquote");
      quote1.classList.add("quote");

      quote1.innerHTML = `
            <span>${quote.id})</span>
            ${quote.quote}
            <footer>${quote.author}
        `;

      quoteTag.appendChild(quote1);
    });
  }

  const hideLoaderFunc = () => {
    loader.classList.remove("show");
  };

  const showLoaderFunc = () => {
    loader.classList.add("show");
  };

  const hasMoreQuotes = (page, limit, total) => {
    const startIndex = (page - 1) * limit + 1;
    return total === 0 || startIndex < total;
  };

  async function loadQuotes(page, limit) {
    showLoaderFunc();

    setTimeout(async () => {
      try {
        if (hasMoreQuotes(page, limit, total)) {
          const response = await getQuotes(page, limit);
          showQuotes(response.data);
          total = response.total;
        }
      } catch (error) {
        console.log(error.message);
      } finally {
        hideLoaderFunc();
      }
    }, 500);
  }

  window.addEventListener(
    "scroll",
    () => {
      const { scrollTop, scrollHeight, clientHeight } =
        document.documentElement;

      if (
        scrollTop + clientHeight >= scrollHeight - 5 &&
        hasMoreQuotes(currentPage, pageLimit, total)
      ) {
        currentPage++;
        loadQuotes(currentPage, pageLimit);
      }
    },
    {
      passive: true,
    }
  );

  loadQuotes(currentPage, pageLimit);
})();
