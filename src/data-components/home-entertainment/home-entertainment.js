import ReactECharts from 'echarts-for-react';
import Papa from 'papaparse';
import homeEntertainmentCSV from './home-entertainment.csv';
import { useState } from 'react';

function HomeEntertainment() {

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
      axisLabel: {
        formatter: '${value}',
      },
      min: 0,
      max: 100,
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

  Papa.parsePromise(homeEntertainmentCSV)
    .then(({data, errors, meta}) => {
      const years = data.splice(0,1)[0].splice(1);
      const type = data.map(datum => datum.splice(0,1)[0]);
      const processedData = data.map((salesByYear, index) => {
        return {
          name: type[index],
          year: years[index],
          type: 'line',
          emphasis: {
            focus: 'series'
          },
          data: salesByYear.map(amount => amount ? parseFloat(amount): 0)
        };
      });

      // reference: https://echarts.apache.org/examples/en/editor.html?c=data-transform-filter

      setOptions({
        xAxis: {
          type: 'category',
          data: years
        },
        yAxis: {
          axisLabel: {
            formatter: '${value}',
          },
          min: 0,
          max: 30,
          type: 'value',
        },
        series: processedData
      });
    });


  return (
    <div>
      <h2>Home Entertainment</h2>
      <div className='home-entertainment-contents'>
        <ReactECharts option={options} />
      </div>
    </div>
  )
}

export default HomeEntertainment;