const puppeteer = require('puppeteer');
var con = require("../db_con").con;


(async () => {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  await page.goto('https://publisher-dev.affluent.io', { waitUntil: 'networkidle0' });
  //login
  await page.type('[name="username"]', 'developertest@affluent.io');
  await page.type('[name="password"]', 'H3lloWorld!');
  await Promise.all([
            page.click('[type="submit"]'),
            page.waitForNavigation({ waitUntil: 'networkidle0' }),
  ]);
  //specific dates
  await page.goto('https://publisher-dev.affluent.io/main?startDate=2019-08-01&endDate=2019-08-31', { waitUntil: 'networkidle0' });
  var data = [];

  //while loop function. runs until next page of table exists
  (function WhileLoop(){
    setTimeout(function(){
      (async () => {
        get_data(page);
        if (await page.$('#DataTables_Table_0_wrapper .pagination [class="next disabled"]') == null){
          page.click('#DataTables_Table_0_wrapper .pagination [class="next"]');
          WhileLoop();
        }
        else{
          await insert_data(data);
        }
      })();
    },3000);
  })();


//function to get data from webpage
  function get_data(page){
    (async () => {
      //table columns
      const ths = await page.evaluate(() => {
        const ths = Array.from(document.querySelectorAll('[id="DataTables_Table_0"] thead [class="heading"] th'))
        return ths.map(th => th.textContent.trim())
      });
      //table rows
      var tds = await page.evaluate(() => {
        const tds = Array.from(document.querySelectorAll('[id="DataTables_Table_0"] tbody tr td'));
        return tds.map(td => td.textContent.trim())
      });
      //saving columns and rows in data[]
      for (let i = 0; i < tds.length;){
        obj = {};
        for (let j = 0 ; j<ths.length; j++){
          obj[ths[j]] = tds[i];
          i++
        }
        data.push(obj);
      }
    })();
  }
})();

//function to insert data into database
function insert_data(data){
  //connect to database
  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    //inse into database
    for(var i = 0; i<data.length; i++){
      //date conversion
      var ut = Date.parse(data[i]['Date']);
      var dateObj = new Date(ut);
      var sql = "insert into dates (Date, CommissionTotal, SalesNet, LeadsNet, Clicks, EPC, Impressions, CR) "
                +"values('"+dateObj.toISOString().split('T')[0]+"',"+data[i]['Commission - Total'].replace('$','')+","+data[i]['Sales - Net']+","+data[i]['Leads - Net']+","+data[i]['Clicks']+","+data[i]['EPC'].replace('$','')+","+data[i]['Impressions'].replace(',','')+","+data[i]['CR'].replace('%','')+");";
      con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("Result: " + result);
      });
    }
  });
}
