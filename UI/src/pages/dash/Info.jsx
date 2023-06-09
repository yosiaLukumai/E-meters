import "./../../App.scss"
import group from "../../assets/group.png"
import { useState } from "react"
import { retriveData } from "../../utils/localStorage"
export const Info = () => {
    const [user, changeUser] =useState(retriveData("userEm"))
    return (
        <>
            <div className="buy">
                <div className="dashIcon" style={{ padding: "1rem 0" }}>
                    <img src={group} alt="bu icon"></img>
                </div>
                <div style={{ paddingTop: "1.2rem 0", textAlign: "center", fontSize: "1.5rem", fontWeight: "bolder", color: "#2B1736ff" }}>
                    Your Account Info
                </div>
                <div style={{ paddingTop: "20px" }}></div>
                <div className="container row infoDesc">
                    <div className="col s4 name">Email</div>
                    <div className="col s6 namespec">{user?.email}</div>
                </div>
                <div className="container row infoDesc">
                    <div className="col s4 name">Meter Id</div>
                    <div className="col s7 namespec">{user?.meterId}</div>
                </div>
                <div className="container row infoDesc">
                    <div className="col s4 name">Tarrif</div>
                    <div className="col s6 namespec">D1</div>
                </div>
                <div className="container row infoDesc">
                    <div className="col s4 name">Avg Usg</div>
                    <div className="col s6 namespec">56 Units/month</div>
                </div>
            </div>

        </>
    )
}