import { useState } from 'react' 
import logo from './logo.svg'
import './App.css'
import { uniq } from "lodash";
import college from "/college"
import { AxisLeft, AxisBottom } from '@visx/axis';
import { scaleLinear, scaleBand, extent, line, symbol, csv } from "d3";
import { Tooltip } from 'react-svg-tooltip';

function App() {

  const majorCategory = uniq(college.map((data) => data.Major_category))
  console.log(majorCategory)
  function filterData(data, category){
    var filteredData = []
    filteredData = data.filter(data => data.Major_category === category);
    const women = filteredData.map((data) => data.ShareWomen)
    const men = filteredData.map((data) => 1 - data.ShareWomen)
    const arrSortWomen = women.sort();
    const lenWomen = women.length;
    const midWomen = Math.ceil(lenWomen / 2);
    const medianWomen = lenWomen % 2 == 0 ? (arrSortWomen[midWomen] + arrSortWomen[midWomen - 1]) / 2 : arrSortWomen[midWomen - 1];

    const arrSortMen = men.sort();
    const lenMen = men.length;
    const midMen = Math.ceil(lenMen / 2);
    const medianMen = lenMen % 2 == 0 ? (arrSortMen[midMen] + arrSortMen[midMen - 1]) / 2 : arrSortMen[midMen - 1];

    return {women: medianWomen, men: medianMen};

  }
  var genderPercentage = []
  for (var i = 0; i < majorCategory.length; i++){
    let median = filterData(college, majorCategory[i])
    genderPercentage.push(median)

  }
  console.log(genderPercentage)
  const differenceWomen = genderPercentage.map((data) => data.women - data.men)
  const differenceMen = genderPercentage.map((data) => data.men - data.women)
  const maxWomen = extent(differenceWomen)
  const maxMen = extent(differenceMen)
  const absForDifferenceWomen = []
  for (i = 0; i < differenceWomen.length; i++) {
    absForDifferenceWomen[i] = Math.abs(differenceWomen[i]);
  }
  const minDifference = Math.min(...absForDifferenceWomen)
  const maxDifferenceData = [{majorCat: "Psychology & Social Work", description: "Top major category that women more than men", data: maxWomen},
                             {majorCat: "Engineering", description: "Top major category that men more than women", data: maxMen},
                             {majorCat:"Physical Sciences", description: "The most balanced major catergory between men and women", data:minDifference},
                             {majorCat:"women more than men", description: "Major categories that have more women than men", data:differenceWomen.map(data => data>0)},
                             {majorCat:"men more than women", description: "Major categories that have more men than women", data:differenceMen.map(data => data>0)}]
  const top3Women = differenceWomen.slice().sort(function (a, b) { return b - a}).slice(0, 3);
  const top3Men = differenceMen.slice().sort(function (a, b) { return b - a}).slice(0, 3);
  console.log(maxDifferenceData.length)
  console.log(maxMen)
  console.log(minDifference)


  const [checkedState, setCheckedState] = useState(
    new Array(majorCategory.length).fill(false)
  );
  console.log(checkedState)


  const handleOnChange = (position) => {
    const updatedCheckedState = checkedState.fill(false).map((data, i) =>
      i === position ? !data : data
    );

    setCheckedState(updatedCheckedState);

    
  };
  


  const chartSize = 500;
  const chartSizeHeight = 500;
  const chartSizeWidth = 1000;
  const margin = 30;
  const legendPadding = 200;
  const chart2SizeHeight = 1700;
  const chart2SizeWidth = 1000;




  const scalePercentageY = scaleLinear()
    .domain([0, 100])
    .range([chartSize, margin]);

  const scalePercentageX = scaleLinear()
    .domain([0, 100])
    .range([0, chartSize]);
  

  const earningIn1000 = college.map(data => data.Median/1000)
  const maxEarning = extent(earningIn1000);


  const arrSortEarning = earningIn1000.sort();
  const lenEarning = earningIn1000.length;
  const midEarning = Math.ceil(lenEarning / 2);
  const medianEarning = earningIn1000.length % 2 == 0 ? (arrSortEarning[midEarning] + arrSortEarning[midEarning - 1]) / 2 : arrSortEarning[midEarning - 1];
  

  const scaleEarning = scaleLinear()
    .domain([0, maxEarning[1]])
    .range([0, 500]);

  const unemploymentRate = college.map(data => data.Unemployment_rate * 100);
  const maxUnemploymentRate = extent(unemploymentRate);
  const scaleUnemploymentRate  = scaleLinear()
    .domain([0, maxUnemploymentRate[1]])
    .range([chartSize, margin]);

  const scaleUnemploymentRateX = scaleLinear()
    .domain([0, maxUnemploymentRate[1]])
    .range([0, chartSize]);

  const [clickedState, setclickedClState] = useState(-1);


  function onMouseEnter(e) {
    e.target.style.fill = 'rgb(255,20,147)';
  }

  function onClick(e) {
    e.target.style.fill = 'rgb(255,20,147)';
    console.log(e.target.id)
    setclickedClState (e.target.id)
  }

  function onMouseLeave(e) {
    e.target.style.fill = "rgba(50,50,50,.3)";
  }



  return (
    <div style={{ margin: 50 }}>
      <h1>College Major Dataset </h1>
      <p>
        The College Major dataset contains {college.length} entries, each entry
        represents a different major and have information about the major.
      </p>
      <h3>choose a major category, click on a dot, or hover on a dot</h3>
      <p>You can see the distribution of the specific major categories by choosing a categories<br></br>
      You can explore individual major and see its information by clicking and hovering on a dot</p>
      <div>
      <h4>Major Catrgories<br></br></h4>
        {majorCategory.map((data, i) =>{
          return(
            <>
              <input 
                type="radio"
                id={data}
                name={data}
                checked={checkedState[i]}
                onChange={() => handleOnChange(i)}
                
              />{data}<br></br>
              {/* <label style={{marginRight: 45}} for={data}>{data}<br></br></label> */}
              
            </>
          )
        })}
        
      </div>
      <div style={{ display: "flex" }} >
        <svg
          width={chartSize + legendPadding}
          height={chartSize + 150}
        >
          <AxisLeft strokeWidth={1} left={100} scale={scalePercentageY} />
          <AxisBottom
              strokeWidth={1}
              top={chartSize}
              left={100}
              scale={scalePercentageX}
          />
          {college.map((data, i) => {
            return (
              <>
              <circle
                key= {i}
                id={i}
                cx={scalePercentageX((1 - data.ShareWomen)*100) + 100}
                cy={scalePercentageY((data.ShareWomen)*100)}
                r={5}
                fill = {clickedState == i? "rgb(255,20,147)": 
                        checkedState[0] == true && data.Major_category === majorCategory[0]?"orange":
                        checkedState[1] == true && data.Major_category === majorCategory[1]?"orange":
                        checkedState[2] == true && data.Major_category === majorCategory[2]?"orange":
                        checkedState[3] == true && data.Major_category === majorCategory[3]?"orange":
                        checkedState[4] == true && data.Major_category === majorCategory[4]?"orange":
                        checkedState[5] == true && data.Major_category === majorCategory[5]?"orange":
                        checkedState[6] == true && data.Major_category === majorCategory[6]?"orange":
                        checkedState[7] == true && data.Major_category === majorCategory[7]?"orange":
                        checkedState[8] == true && data.Major_category === majorCategory[8]?"orange":
                        checkedState[9] == true && data.Major_category === majorCategory[9]?"orange":
                        checkedState[10] == true && data.Major_category === majorCategory[10]?"orange":
                        checkedState[11] == true && data.Major_category === majorCategory[11]?"orange":
                        checkedState[12] == true && data.Major_category === majorCategory[12]?"orange":
                        checkedState[13] == true && data.Major_category === majorCategory[13]?"orange":
                        checkedState[14] == true && data.Major_category === majorCategory[14]?"orange":
                        checkedState[15] == true && data.Major_category === majorCategory[15]?"orange":
                        "rgba(50,50,50,.3)"} 
                onMouseEnter = {onMouseEnter}
                onMouseLeave = {onMouseLeave}
                onClick = {onClick}
              > 
                <title>
                  Major: {data.Major}, Percentage of Women: {(data.ShareWomen)*100}%, Percentage of Men: {(1- data.ShareWomen)*100}%
                </title>
              </circle>
              
              

              </>
            
              
            );
          })}

          

          
          <text x="-300" y="30" transform="rotate(-90)" fontSize={16}>
            Percentage of Women (%)
          </text>

          <text x="250" y="550" fontSize={16}>
            Percentage of Men (%)
          </text>
          
          
        </svg>

        <svg
          width={chartSize + legendPadding}
          height={chartSize + 150}
        >
          <AxisLeft strokeWidth={1} left={100} scale={scaleUnemploymentRate} />
          <AxisBottom
              strokeWidth={1}
              top={chartSize}
              left={100}
              scale={scaleEarning}
          />


          {college.map((data, i) => {
            return (
              <>
              <circle
                key= {i}
                id={i}
                cx={scaleEarning(data.Median / 1000)+100}
                cy={scaleUnemploymentRate(data.Unemployment_rate*100)}
                r={5}
                fill = {clickedState == i? "rgb(255,20,147)": 
                checkedState[0] == true && data.Major_category === majorCategory[0]?"orange":
                checkedState[1] == true && data.Major_category === majorCategory[1]?"orange":
                checkedState[2] == true && data.Major_category === majorCategory[2]?"orange":
                checkedState[3] == true && data.Major_category === majorCategory[3]?"orange":
                checkedState[4] == true && data.Major_category === majorCategory[4]?"orange":
                checkedState[5] == true && data.Major_category === majorCategory[5]?"orange":
                checkedState[6] == true && data.Major_category === majorCategory[6]?"orange":
                checkedState[7] == true && data.Major_category === majorCategory[7]?"orange":
                checkedState[8] == true && data.Major_category === majorCategory[8]?"orange":
                checkedState[9] == true && data.Major_category === majorCategory[9]?"orange":
                checkedState[10] == true && data.Major_category === majorCategory[10]?"orange":
                checkedState[11] == true && data.Major_category === majorCategory[11]?"orange":
                checkedState[12] == true && data.Major_category === majorCategory[12]?"orange":
                checkedState[13] == true && data.Major_category === majorCategory[13]?"orange":
                checkedState[14] == true && data.Major_category === majorCategory[14]?"orange":
                checkedState[15] == true && data.Major_category === majorCategory[15]?"orange":
                "rgba(50,50,50,.3)"}
                onClick = {onClick}
                onMouseEnter = {onMouseEnter}
                onMouseLeave = {onMouseLeave}
              >
                <title>
                  Major: {data.Major}, Median Earning: ${data.Median}, Unemployment Rate: {data.Unemployment_rate*100}%
                </title>
              </circle>
              
              </>
              
            );
          })}

          
          <text x="-300" y="30" transform="rotate(-90)" fontSize={16}>
            Unemployment Rate (%)
          </text>

          <text x="250" y="550" fontSize={16}>
            Median Earnings (in $1000)
          </text>
          
          
          
        </svg>
        
      </div>

      

      

      <div style={{ display: "flex" }}>
        <svg
          width={chartSize + legendPadding}
          height={chartSize + 150}
        >
          <AxisLeft strokeWidth={1} left={100} scale={scalePercentageY} />
          <AxisBottom
              strokeWidth={1}
              top={chartSize}
              left={100}
              scale={scaleEarning}
          />


          {college.map((data, i) => {
            return (

              <circle
                key={i}
                id={i}
                cx={scaleEarning(data.Median / 1000)+100}
                cy={scalePercentageY((data.ShareWomen)*100)}
                r={5}
                fill = {clickedState == i? "rgb(255,20,147)": 
                        checkedState[0] == true && data.Major_category === majorCategory[0]?"orange":
                        checkedState[1] == true && data.Major_category === majorCategory[1]?"orange":
                        checkedState[2] == true && data.Major_category === majorCategory[2]?"orange":
                        checkedState[3] == true && data.Major_category === majorCategory[3]?"orange":
                        checkedState[4] == true && data.Major_category === majorCategory[4]?"orange":
                        checkedState[5] == true && data.Major_category === majorCategory[5]?"orange":
                        checkedState[6] == true && data.Major_category === majorCategory[6]?"orange":
                        checkedState[7] == true && data.Major_category === majorCategory[7]?"orange":
                        checkedState[8] == true && data.Major_category === majorCategory[8]?"orange":
                        checkedState[9] == true && data.Major_category === majorCategory[9]?"orange":
                        checkedState[10] == true && data.Major_category === majorCategory[10]?"orange":
                        checkedState[11] == true && data.Major_category === majorCategory[11]?"orange":
                        checkedState[12] == true && data.Major_category === majorCategory[12]?"orange":
                        checkedState[13] == true && data.Major_category === majorCategory[13]?"orange":
                        checkedState[14] == true && data.Major_category === majorCategory[14]?"orange":
                        checkedState[15] == true && data.Major_category === majorCategory[15]?"orange":
                        "rgba(50,50,50,.3)"}
                onMouseEnter = {onMouseEnter}
                onMouseLeave = {onMouseLeave}
                onClick = {onClick}
              > 
              <title>
                  Major: {data.Major}, Percentage of Women: {(data.ShareWomen)*100}%, Median Earning: ${data.Median}
                </title>
              </circle>
            );
          })}

          
          <text x="-300" y="30" transform="rotate(-90)" fontSize={16}>
            Percentage of Women (%)
          </text>

          <text x="250" y="550" fontSize={16}>
            Median Earnings (in $1000)
          </text>
          
          
        </svg>

        <svg
          width={chartSize + legendPadding}
          height={chartSize + 150}
        >
          <AxisLeft strokeWidth={1} left={100} scale={scalePercentageY} />
          <AxisBottom
              strokeWidth={1}
              top={chartSize}
              left={100}
              scale={scaleEarning}
          />


          {college.map((data, i) => {
            return (

              <circle
                key={i}
                id={i}
                cx={scaleUnemploymentRateX(data.Unemployment_rate*100)+100}
                cy={scalePercentageY((data.ShareWomen)*100)}
                r={5}
                fill = {clickedState == i? "rgb(255,20,147)": 
                        checkedState[0] == true && data.Major_category === majorCategory[0]?"orange":
                        checkedState[1] == true && data.Major_category === majorCategory[1]?"orange":
                        checkedState[2] == true && data.Major_category === majorCategory[2]?"orange":
                        checkedState[3] == true && data.Major_category === majorCategory[3]?"orange":
                        checkedState[4] == true && data.Major_category === majorCategory[4]?"orange":
                        checkedState[5] == true && data.Major_category === majorCategory[5]?"orange":
                        checkedState[6] == true && data.Major_category === majorCategory[6]?"orange":
                        checkedState[7] == true && data.Major_category === majorCategory[7]?"orange":
                        checkedState[8] == true && data.Major_category === majorCategory[8]?"orange":
                        checkedState[9] == true && data.Major_category === majorCategory[9]?"orange":
                        checkedState[10] == true && data.Major_category === majorCategory[10]?"orange":
                        checkedState[11] == true && data.Major_category === majorCategory[11]?"orange":
                        checkedState[12] == true && data.Major_category === majorCategory[12]?"orange":
                        checkedState[13] == true && data.Major_category === majorCategory[13]?"orange":
                        checkedState[14] == true && data.Major_category === majorCategory[14]?"orange":
                        checkedState[15] == true && data.Major_category === majorCategory[15]?"orange":
                        "rgba(50,50,50,.3)"}
                onMouseEnter = {onMouseEnter}
                onMouseLeave = {onMouseLeave}
                onClick = {onClick}
              > 
              <title>
                  Major: {data.Major}, Percentage of Women: {(data.ShareWomen)*100}%, Unemployment Rate: {data.Unemployment_rate*100}%
                </title>
              </circle>
            );
          })}

          
          <text x="-300" y="30" transform="rotate(-90)" fontSize={16}>
            Percentage of Women (%)
          </text>

          <text x="250" y="550" fontSize={16}>
            Unemployment Rate (%)
          </text>
          
          
        </svg>
        
      </div>
          

        
    </div>
  );
}


export default App