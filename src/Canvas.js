import React, { useRef, useState, useEffect } from "react";
import image from "./black.jpg";

const Canvas = () => {
  const [xCoor, setXCoor] = useState(0);
  const [yCoor, setYCoor] = useState(0);
  const [color, setColor] = useState("#FFFFFF");
  const [points, setPoints] = useState([]);
  const [allPoints, setAllPoints] = useState([]);
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const imgRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [thickness, setThickness] = useState(3);
  const [newOne, setNewOne] = useState(false);

  const style = {
    border: "2px solid gray",
    boxShadow: "0 0 25px grey",
    padding: 0,
    margin: "10px",
  };

  const handleStart = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    contextRef.current = ctx;
    contextRef.current.drawImage(imgRef.current, 0, 0, 720, 540);

    setDrawing(!drawing);
    setPoints([]);
    setXCoor(0);
    setYCoor(0);
    setThickness(3);
    setColor("#FFFFFF");
    setNewOne(true);
    setAllPoints([]);
  };

  const handleMouseMove = (e) => {
    let rect = canvasRef.current.getBoundingClientRect();
    setXCoor(e.clientX - rect.left);
    setYCoor(e.clientY - rect.top);
  };

  const handleClick = () => {
    drawing
      ? setPoints((prev) => [...prev, [xCoor, yCoor]])
      : alert("Start drawing first!");
  };

  const handleNew = () => {
    setPoints([]);
    setNewOne(true);
  };

  const handleUndo = () => {
    let newPoints =
      allPoints.length > 1
        ? allPoints.filter((value, index) => index !== allPoints.length)
        : allPoints.filter((value, index) => index !== allPoints.length - 1);

    let lastOne = allPoints[allPoints.length - 1];
    let newOne = lastOne.filter((value, index) => index !== lastOne.length - 1);

    setPoints(newOne);
    setAllPoints(newPoints);
  };

  const drawLine = () => {
    allPoints?.forEach((area) => {
      if (area.length > 1) {
        for (let i = 0; i < area.length - 1; i++) {
          contextRef.current.beginPath();
          contextRef.current.strokeStyle = color;
          contextRef.current.lineWidth = thickness;
          contextRef.current.lineCap = "round";
          contextRef.current.moveTo(area[i][0], area[i][1]);
          contextRef.current.lineTo(area[i + 1][0], area[i + 1][1]);
          contextRef.current.stroke();
        }
      }
    });
  };

  const drawCircle = (area) => {
    area.forEach((item) => {
      let x =
        typeof item === "number" ? allPoints[allPoints.length - 1][0] : item[0];
      let y =
        typeof item === "number" ? allPoints[allPoints.length - 1][1] : item[1];

      contextRef.current.beginPath();
      contextRef.current.fillStyle = color;
      contextRef.current.arc(x, y, thickness, 0, 2 * Math.PI);
      contextRef.current.fill();
    });
  };

  useEffect(() => {
    if (points.length > 0) {
      let newPoints = [];

      if (newOne) {
        // newPoints.push(points);
        newPoints = allPoints.concat(points);
        setAllPoints((prev) => [...prev, newPoints]);
        setNewOne(false);
      } else {
        for (let i = 0; i < allPoints.length; i++) {
          i !== allPoints.length - 1 && newPoints.push(allPoints[i]);
        }
        newPoints.push(points);
      }
      setAllPoints(newPoints);
    } else {
      if (allPoints.length > 1 && !newOne) {
        let newPoints = allPoints.filter(
          (value, index) => index < allPoints.length - 1
        );
        setAllPoints(newPoints);
      }
    }
  }, [points]);

  useEffect(() => {
    contextRef?.current?.clearRect(0, 0, 720, 540);
    contextRef?.current?.drawImage(imgRef.current, 0, 0, 720, 540);
    allPoints?.forEach((area) => {
      drawCircle(area);
    });
    drawLine();
  }, [allPoints]);

  return (
    <>
      <img
        src={image}
        alt="myImage"
        width="720"
        height="540"
        ref={imgRef}
        hidden
      />
      <button onClick={handleStart}>
        {drawing !== true ? "Start Drawing" : "Restart"}
      </button>
      <button>Finish Drawing</button>
      <br /> <br />
      <canvas
        width="720"
        height="540"
        alt="myCanvas"
        ref={canvasRef}
        style={style}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
      ></canvas>
      <br />
      <span>{`Mouse X: ${xCoor}`}</span> &nbsp;
      <span>{`Mouse Y: ${yCoor}`}</span> <br />
      <label htmlFor="color">Color:&nbsp;</label>
      <input
        type={"color"}
        value={color}
        id="color"
        onChange={(e) => setColor(e.target.value)}
      />
      &nbsp;
      <label htmlFor="thickness">Thickness:&nbsp;</label>
      <select
        value={thickness}
        onChange={(e) => setThickness(e.target.value)}
        id="thickness"
      >
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
      </select>
      &nbsp;&nbsp;
      <button onClick={handleUndo} disabled={!allPoints.length > 0}>
        Undo
      </button>
      &nbsp;
      <button onClick={handleNew}>Draw One More</button>
    </>
  );
};

export default Canvas;
