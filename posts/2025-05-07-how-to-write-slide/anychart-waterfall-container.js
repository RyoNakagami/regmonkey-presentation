if (typeof setupSeries === 'undefined') {
    function setupSeries(series, name, color, hoveredColor) {
        series.name(name).stroke("2 #fff 1").fill(color);
        series.hovered().stroke("1 #fff 1").fill(hoveredColor);
    }
}

anychart.onDocumentReady(function () {
    const fontsize = 16;

    const data = [
        {x: '営業利益(2010年)', value: 38 , custom_field: "売上 140"},
        {x: '売上増加', value: 26},
        {x: '原価', value: -7},
        {x: '人件費', value: -20,},
        {x: '広告宣伝費', value: -5},
        {x: 'その他費用', value: -7},
        {x: '営業利益(2019年)', isTotal: true, custom_field: "売上 166"}];

    // create a waterfall chart
    let chart = anychart.waterfall();
    let series = chart.waterfall(data); // returns the series

    series.labels()
          .format("{%Value}")  // You can also use "{%y}" for the Y value
          .fontColor("#1a1a1a") // Good contrast inside a colored bar
          .fontSize(20);

    // axis config
    var yScale = chart.yScale();
    yScale.minimum(0);
    yScale.maximum(70);

    // color config
    series.normal().fill("#000080", 0.8);
    series.normal().fallingFill("#808080", 0.3);
    series.normal().fallingStroke("#808080", 1, "10 5", "round");
    series.normal().risingFill("#1E90FF", 0.3);
    series.normal().risingStroke("#1E90FF", 1, "10 5", "round");

    series.select(3);
    
    chart.xAxis().stroke({ color: "black", thickness: 1 });
    chart.yAxis().stroke({ color: "black", thickness: 1 });

    // label config
    var labels = chart.xAxis().labels();
    labels.fontFamily("MeiryoUI")
          .fontSize(fontsize)
          .fontColor("#000000")
          .fontSize(20)
          .useHtml(false);
    
    var labels = chart.yAxis().labels();
    labels.fontFamily("MeiryoUI")
          .fontSize(fontsize)
          .fontColor("#000000")
          .fontSize(16)
          .useHtml(false);

    // title config
    var title = chart.title();
    title.enabled(true)
         .text("営業利益増減の内訳(2010年 vs 2019年)")
         .fontSize(28)
         .fontColor("#575757")
         .fontFamily("MeiryoUI")
         .fontWeight(200);
    // title.fontDecoration("underline");
    chart.tooltip().titleFormat("Absolute | Difference");
    chart.tooltip().format("{%absolute}\n{%diff}\n\n{%custom_field}");

    
    chart.container('anychart-waterfall-container');
    chart.draw();;



});