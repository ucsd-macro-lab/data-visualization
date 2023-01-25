import ReactECharts from 'echarts-for-react';
import Papa from 'papaparse';
import distributorMarketShareCSV from './film-distributor-market-share-95-19.csv';
// import { parse } from 'csv-parse';

function DistributorMarketShare() {

  Papa.parsePromise = (file) => {
    return new Promise((complete, error) => {
      Papa.parse(file, {
        download: true,
        complete: complete,
        error: error,
      });
    });
  };

  Papa.parsePromise(distributorMarketShareCSV)
    .then(({data, errors, meta}) => {
      // var data = results.data
      const columns = data.splice(0,1)[0];
      console.log(columns);
      console.log(data);

      // Group all years by top orgs
      // get the share percentage of all orgs

    });

  const options = {
    grid: { top: 8, right: 8, bottom: 24, left: 36 },
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: 'Email',
        type: 'line',
        stack: 'Total',
        areaStyle: {},
        emphasis: {
          focus: 'series'
        },
        data: [120, 132, 101, 134, 90, 230, 210]
      },
      {
        name: 'Union Ads',
        type: 'line',
        stack: 'Total',
        areaStyle: {},
        emphasis: {
          focus: 'series'
        },
        data: [220, 182, 191, 234, 290, 330, 310]
      },
      {
        name: 'Video Ads',
        type: 'line',
        stack: 'Total',
        areaStyle: {},
        emphasis: {
          focus: 'series'
        },
        data: [150, 232, 201, 154, 190, 330, 410]
      },
      {
        name: 'Direct',
        type: 'line',
        stack: 'Total',
        areaStyle: {},
        emphasis: {
          focus: 'series'
        },
        data: [320, 332, 301, 334, 390, 330, 320]
      },
      {
        name: 'Search Engine',
        type: 'line',
        stack: 'Total',
        label: {
          show: true,
          position: 'top'
        },
        areaStyle: {},
        emphasis: {
          focus: 'series'
        },
        data: [820, 932, 901, 934, 1290, 1330, 1320]
      }
    ],
    tooltip: {
      trigger: 'axis',
    },
  };

  return (
    <div className="distributor-market-share">
      <ReactECharts option={options}/>
    </div>
  );
}

export default DistributorMarketShare;
