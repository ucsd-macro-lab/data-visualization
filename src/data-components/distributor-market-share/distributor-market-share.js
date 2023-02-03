import ReactECharts from 'echarts-for-react';
import Papa from 'papaparse';
import top6DistributorMarketShareCSV from './top-6-distributor-market-share.csv';
import distributorMarketShareCSV from './film-distributor-market-share-95-19.csv';
import './distributor-market-share.css';
import { useState } from 'react';
import Slider from '@mui/material/Slider';
import { styled } from '@mui/material/styles';
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
  const [dataByYear, setDataByYear] = useState([]);
  const [years, setYears] = useState([]);

  const minYearDistance = 1;
  const [yearRange, setYearRange] = useState([1995, 2019]);

  // 'share', 
  const updateYearRange = (event, newYearRange, activeThumb) => {
    if (activeThumb === 0) {
      setYearRange([Math.min(newYearRange[0], yearRange[1] - minYearDistance), yearRange[1]]);
    } else {
      setYearRange([yearRange[0], Math.max(newYearRange[1], yearRange[0]) + minYearDistance]);
    }
  }

  Papa.parsePromise = (file) => {
    return new Promise((complete, error) => {
      Papa.parse(file, {
        download: true,
        complete: complete,
        error: error,
      });
    });
  };


  Papa.parsePromise(top6DistributorMarketShareCSV)
    .then(({data, errors, meta}) => {
      const years = data.splice(0,1)[0].splice(1);
      setYears(years);
      // setYearRange([years[0], years[years.length-1]]);
      const totals = data.splice(data.length-1,1)[0];
      // console.log(totals);
      // console.log(years);
      const distributors = data.map(datum => datum.splice(0,1)[0]);
      // console.log(distributors);
      // console.log(data);
      const processedData = data.map((companySharesByYear, index) => {
        return {
          name: distributors[index],
          year: years[index],
          type: 'line',
          stack: 'Total',
          areaStyle: {},
          emphasis: {
            focus: 'series'
          },
          data: companySharesByYear.map(percent => percent ? parseFloat(percent): 0)
        };
      });
      setDataByYear(processedData);

      setOptions({
        xAxis: {
          type: 'category',
          data: years.filter(year => yearRange[0] <= year && year <= yearRange[1]),
        },
        yAxis: {
          axisLabel: {
            formatter: '{value}%',
          },
          min: 0,
          max: 100,
          type: 'value',
        },
        series: dataByYear.filter(data => yearRange[0] <= data.year && data.year <= yearRange[1]).reverse(),
      });
    });

  return (
    <div className="distributor-market-share">
      <h2>Film Distributor Market Share</h2>
      <div className='distributor-contents'>
        <ReactECharts option={options} style={{height: '100%', width: '70%'}}/>
        <div className='distributor-side-bar'>
          <h4>Group by</h4>
          <h4>Result</h4>
          <h4>Year Range</h4>
          <Slider
            style={{paddingTop: '60px'}}
            sx={{
              color: '#3880ff',
              height: 2,
              padding: '30px 0',
              '& .MuiSlider-thumb': {
                height: 15,
                width: 15,
              },
              '& .MuiSlider-valueLabel': {
                fontSize: 12,
                fontWeight: 'normal',
                top: -6,
                backgroundColor: 'unset',
                color: 'black',
                '&:before': {
                  display: 'none',
                },
              },
            }}
            getAriaLabel={() => 'Year Range'}
            value={yearRange}
            onChange={updateYearRange}
            valueLabelDisplay="on"
            // getAriaValueText={valuetext}
            step={1}
            // marks
            min={1995}
            max={2019}
          />
        </div>
      </div>
    </div>
  );
}

export default DistributorMarketShare;
