import ReactECharts from 'echarts-for-react';
import Papa from 'papaparse';
import top6DistributorMarketShareCSV from './top-6-distributor-market-share.csv';
import distributorMarketShareCSV from './film-distributor-market-share-95-19.csv';
import './distributor-market-share.css';
import { useState } from 'react';
// import { parse } from 'csv-parse';

const groupBy = (xs, key) => {
  return xs.reduce((rv, x) => {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

function DistributorMarketShare() {

  const [options, setOptions] = useState({
    responsive: true,
    maintainAspectRatio: false,
    grid: {
      // width: '100%',
      // height: '100%',
    },
    xAxis: {
      type: 'category',
      data: [],
    },
    yAxis: {
      type: 'value',
    },
    series: [],
    tooltip: {
      trigger: 'axis',
    },
  });

  Papa.parsePromise = (file) => {
    return new Promise((complete, error) => {
      Papa.parse(file, {
        download: true,
        complete: complete,
        error: error,
      });
    });
  };

  // Papa.parsePromise(distributorMarketShareCSV)
  //   .then(({data, errors, meta}) => {
  //     // var data = results.data
  //     const columns = data.splice(0,1)[0];
  //     console.log(columns);
  //     console.log(data);
  //     const distributorDataByYear = groupBy(data, 0);
  //     // Group all years by top orgs
  //     // get the share percentage of all orgs
  //     console.log(distributorDataByYear);
  //     const years = Object.keys(distributorDataByYear);

  //     // const distributorShareByYear = Object.entries(distributorDataByYear).map(([year, distributorData]) => {
  //     //   return distributorData.map(data => parseFloat(data.Share));
  //     // });

  //   });

  Papa.parsePromise(top6DistributorMarketShareCSV)
    .then(({data, errors, meta}) => {
      const years = data.splice(0,1)[0].splice(1);
      const totals = data.splice(data.length-1,1)[0];
      // console.log(totals);
      // console.log(years);
      const distributors = data.map(datum => datum.splice(0,1)[0]);
      // console.log(distributors);
      // console.log(data);
      const processedData = data.map((companySharesByYear, index) => {
        return {
          name: distributors[index],
          type: 'line',
          stack: 'Total',
          areaStyle: {},
          emphasis: {
            focus: 'series'
          },
          data: companySharesByYear.map(percent => percent ? parseFloat(percent): 0)
        };
      })

      setOptions({
        xAxis: {
          type: 'category',
          data: years,
        },
        yAxis: {
          axisLabel: {
            formatter: '{value}%',
          },
          min: 0,
          max: 100,
          type: 'value',
        },
        series: processedData.reverse(),
      });

    });

  return (
    <div className="distributor-market-share">
      <ReactECharts option={options} style={{height: '100%', width: '100%'}}/>
    </div>
  );
}

export default DistributorMarketShare;
