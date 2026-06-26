import React from 'react'
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend
} from "recharts";
const COLORS = [
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#ef4444"
];



const Chart = (props) => {
    
    return (
        <div>
            <PieChart width={500} height={550} >
                <Pie
                    data={props.data}
                    cx="50%"
                    cy="50%"
                    outerRadius={160}
                    dataKey="value"
                    label
                >
                    {props.data.map((entry, index) => (
                        <Cell
                            key={index}
                            fill={COLORS[index % COLORS.length]}
                        />
                    ))}
                </Pie>

                <Tooltip />
                <Legend />
            </PieChart>
        </div>

    )
}

export default Chart


