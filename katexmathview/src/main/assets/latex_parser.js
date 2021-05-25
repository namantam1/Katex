const latexify = (string, options, element = document.body) => {
  const regularExpression = /\$\$[\s\S]+?\$\$|\\\[[\s\S]+?\\\]|\\\([\s\S]+?\\\)|\$[^$\\]*(?:\\.[^$\\]*)*\$/g;
  const blockRegularExpression = /\$\$[\s\S]+?\$\$|\\\[[\s\S]+?\\\]/g;

  const stripDollars = (stringToStrip) =>
  (stringToStrip[0] === "$" && stringToStrip[1] !== "$"
    ? stringToStrip.slice(1, -1)
    : stringToStrip.slice(2, -2));

  const getDisplay = (stringToDisplay) =>
    (stringToDisplay.match(blockRegularExpression) ? "block" : "inline");

  const renderLatexString = (s, t) => {
    let renderedString;
    try {
      // returns HTML markup
      renderedString = katex.renderToString(
        s,
        { ...options, displayMode: t === "block" }
      );
    } catch (err) {
      console.error("couldn`t convert string", err, s);
      return s;
    }
    return renderedString;
  };

  const result = [];

  const latexMatch = string.match(regularExpression);
  const stringWithoutLatex = string.split(regularExpression);

  if (latexMatch) {
    stringWithoutLatex.forEach((s, index) => {
      result.push({
        string: s,
        type: "text",
      });
      if (latexMatch[index]) {
        result.push({
          string: stripDollars(latexMatch[index]),
          type: getDisplay(latexMatch[index]),
        });
      }
    });
  } else {
    result.push({
      string,
      type: "text",
    });
  }

  const processResult = (resultToProcess) => {
    const newResult = resultToProcess.map((r) => {
      if (r.type === "text") {
        return r.string;
      }
      return renderLatexString(r.string, r.type);
    });

    return newResult;
  };

  element.innerHTML = processResult(result).join("\n")
};

(function () {
  document.addEventListener("DOMContentLoaded", function () {
    latexify(str, {}, document.body)
  });
})();

