// pages/index.js
import { useEffect } from "react";
import $ from "jquery";
import mqtt from "mqtt";

const Home = () => {
  useEffect(() => {
    const clientId = "mqttjs_" + Math.random().toString(16).substr(2, 8);

    const host = "ws://broker.emqx.io:8083/mqtt";

    const options = {
      keepalive: 60,
      clientId: clientId,
      protocolId: "MQTT",
      protocolVersion: 4,
      clean: true,
      reconnectPeriod: 1000,
      connectTimeout: 30 * 1000,
      will: {
        topic: "WillMsg",
        payload: "Connection Closed abnormally..!",
        qos: 0,
        retain: false,
      },
    };

    $("#mqtt-status").text("LOADING...");
    $("#sensor-status").text("WATING...");

    console.log("Connecting mqtt client");
    const client = mqtt.connect(host, options);

    client.on("error", (err) => {
      console.log("Connection error: ", err);
      client.end();
    });

    client.on("reconnect", () => {
      console.log("Reconnecting...");
    });

    client.on("connect", () => {
      console.log("Client connected:" + clientId);

      $("#mqtt-status").text("TERHUBUNG").addClass("text-success");

      // Subscribe
      client.subscribe("sysyphean_prj1/#", {
        qos: 0,
      });
    });

    client.on("message", (topic, message, packet) => {
      console.log(
        "Received Message: " +
          message.toString() +
          "\nOn topic: " +
          topic +
          "\n On Packet:" +
          packet
      );

      if (topic == "sysyphean_prj1/relay") {
        if (message.toString() == 1) {
          $("#sensor-status")
            .text("NYALA")
            .addClass("text-success")
            .removeClass("text-danger");
        } else {
          $("#sensor-status")
            .text("MATI")
            .addClass("text-danger")
            .removeClass("text-success");
        }
      }
    });
  }, []);

  return (
    <div>
      <div className="">
        <div className="row justify-content-center">
          <div className="col-lg-12 text-center mb-4 mt-5">
            <h5>Monitoring Panel Box Mobile</h5>
            <h6>
              <b>By Next.js v14</b>
            </h6>
          </div>
          <div className="col-10 col-lg-4 col-md-6 mb-4">
            <div className="card card-custom">
              <div className="card-body px-4 py-4-5">
                <div className="row">
                  <div className="col-md-8 col-lg-12 col-xl-12 col-xxl-7">
                    <h6 className="text-muted font-semibold">Status Listrik</h6>
                    <h6 id="sensor-status" className="font-extrabold mb-0"></h6>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-10 col-lg-4 col-md-6 mb-4">
            <div className="card card-custom">
              <div className="card-body px-4 py-4-5">
                <div className="row">
                  <div className="col-md-8 col-lg-12 col-xl-12 col-xxl-7">
                    <h6 className="text-muted font-semibold">MQTT Status</h6>
                    <h6 id="mqtt-status" className="font-extrabold mb-0"></h6>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
