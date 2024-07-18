// pages/index.js
import { useEffect } from "react";
import $ from "jquery";
import mqtt from "mqtt";

const Home = () => {
  useEffect(() => {
    const clientId = Math.random().toString(16).substr(2, 8);
    const host = "wss://sysyphean-ad4aip.a01.euc1.aws.hivemq.cloud:8884/mqtt";

    const options = {
      keepalive: 30,
      clientId: "ece22cdc-261e-43cf-8f36-9d01acda55c0-sysyphean-1",
      username: "sysyphean",
      password: "123.Qwerty",
      protocolId: "MQTT",
      protocolVersion: 4,
      clean: true,
      reconnectPeriod: 1000,
      connectTimeout: 30 * 1000,
    };

    console.log("Menghubungkan ke Broker");

    $("#mqtt-status").text("LOADING...");
    $("#sensor-status").text("WAITING...");

    const client = mqtt.connect(host, options);

    client.on("connect", () => {
      console.log(`Terhubung pada ${new Date().toISOString()}`);
      $("#mqtt-status").text("TERHUBUNG").addClass("text-success");
      client.subscribe("sensor/status/#", { qos: 0 }, (err) => {
        if (err) {
          console.log(`Error subscribing: ${err}`);
        } else {
          console.log(`Subscribed pada ${new Date().toISOString()}`);
        }
      });
    });

    client.on("message", function (topic, payload) {
      console.log(
        `Message received pada ${new Date().toISOString()}: Topic: ${topic}, Payload: ${payload}`
      );
      if (topic === "sensor/status/") {
        if (payload == 1) {
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
