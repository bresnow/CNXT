import { ActionFunction, json, LoaderFunction, useLocation } from "remix";
import { LoadCtx } from "types";
import Gun, { ISEAPair } from "gun";
import { getSession } from "../../../../session.server";
import LZString from "lz-string";
import { useFetcherAsync } from "~/rmxgun-context/useFetcherAsync";

export default function FormatRoute() {
  let location = useLocation();
  let { load, cached } = useFetcherAsync(location.pathname);
  return <SuspendedLayout />;
}

function SuspendedLayout({
  load,
  cache,
}: {
  load?: () => Record<string, any>;
  cache?: Record<string, any>;
}) {
  return (
    <>
      <div className="relative bg-gray-100 min-h-screen flex" id="app">
        <nav className="w-16 bg-white shadow-lg flex flex-col items-center">
          <a className="text-3xl font-black mt-2 mb-8">K</a>
          <img
            src="https://image.flaticon.com/icons/svg/61/61689.svg"
            className="h-8 w-8 mb-10 cursor-pointer hover:opacity-100"
          />

          <img
            src="https://image.flaticon.com/icons/svg/179/179679.svg"
            className="h-8 w-8 opacity-25 hover:opacity-100 mb-10 cursor-pointer"
          />

          <img
            src="https://image.flaticon.com/icons/svg/1077/1077076.svg"
            className="h-8 w-8 opacity-25  cursor-pointer mb-10"
          />

          <img
            src="https://image.flaticon.com/icons/svg/61/61122.svg"
            className="h-8 w-8 opacity-25  cursor-pointer"
          />
        </nav>
        <div className="w-full">
          <div className="h-24 bg-header flex justify-between items-start px-16 pt-4">
            <h2 className="text-4xl text-white font-bold"></h2>
            <div className="flex items-center">
              <img className="h-12 w-12 mr-4 rounded-full border-2 border-blue-500" />{" "}
              <h4 className="text-white font-thin">John Doe</h4>
            </div>
          </div>
          <div className="px-16 bg-header flex items-center">
            <div className="filter-menu h-12 px-4 py-3 rounded-full bg-gray-200 w-1/2 flex justify-between items-center">
              <span className="text-white text-xs">Show Only: </span>
              <div className="options flex items-center py-2">
                <button className="text-xs font-thin p-1 border-2 text-white rounded-full w-24 hover:bg-white hover:text-black mr-4">
                  All
                </button>
                <button className="text-xs flex items-center justify-between opacity-50 font-thin py-1 border-2 text-white rounded-full w-26 hover:bg-white hover:text-black mr-4 px-2">
                  Confirmed
                  <img
                    className="pl-1 h-4 w-4"
                    src="https://image.flaticon.com/icons/svg/443/443138.svg"
                  />
                </button>
                <button className="text-xs flex items-center justify-between opacity-50 font-thin py-1 border-2 text-white rounded-full w-26 hover:bg-white hover:text-black mr-4 px-4">
                  Pending
                  <img
                    className="pl-1 h-4 w-4"
                    src="https://image.flaticon.com/icons/svg/189/189106.svg"
                  />
                </button>
                <button className="text-xs flex items-center justify-between opacity-50 font-thin py-1 border-2 text-white rounded-full w-26 hover:bg-white hover:text-black px-2">
                  Cancelled
                  <img
                    className="pl-1 h-3 w-3"
                    src="https://image.flaticon.com/icons/svg/579/579006.svg"
                  />
                </button>
              </div>
            </div>
            <div className="ml-4 filter-menu h-12 p-btn rounded-full bg-gray-200 w-48 flex justify-between items-stretch">
              <div className="bg-green-500 hover:bg-green-400 cursor-pointer flex justify-center items-center rounded-full w-48 text-white">
                <img
                  className="invert h-4 w-4 mr-3"
                  src="https://image.flaticon.com/icons/svg/227/227121.svg"
                  alt=""
                />{" "}
                <span className="font-hairline">Add Klatsch</span>
              </div>
            </div>
          </div>
          <div className="bg-header flex  px-16 pt-4 items-baseline">
            <h4 className="text-xl font-bold text-white w-1/2">Today</h4>
            <p className="w-48 italic text-sm opacity-75 text-white font-hairline text-right">
              Meeting in 19 minutes
            </p>
          </div>
          <header className="h-16  bg-header w-full  rounded-bl-full"></header>

          <div className="px-16 pt-8 content">
            <div className="h-2 border-gray-200 border-t-2 w-2/3"></div>
            <h4 className="text-xl font-bold text-gray-800 w-1/2 pt-4 mb-4">
              Upcoming
            </h4>
          </div>
          <div className="klatsch-grid"></div>
        </div>
        <div className="sidebar absolute right-0 bottom-0 top-0 w-1/4 bg-white mt-20 shadow-lg">
          <div className="relative text-center flex justify-center items-center border-b py-4 border-gray-200">
            <span> </span>{" "}
            <span className="ml-4 mr-2 font-extrabold text-xl text-gray-900">
              September
            </span>{" "}
            <span className="mr-4 text-xl text-gray-600">2019</span>{" "}
            <span></span>{" "}
            <span className="absolute text-xl right-0 top-0 px-6 pt-1"> </span>
          </div>
          <div className="flex justify-center items-center py-6 border-b border-gray-200">
            <div className="flex flex-col justify-center items-center">
              <div className="h-8 w-8 rounded-full flex justify-center items-center text-white" />{" "}
            </div>
            <div>
              <span className=" font-extrabold">5</span>
              <span className="text-sm text-gray-600"> Confirmed</span>
            </div>
          </div>
          <div className="mx-4 flex flex-col justify-center items-center">
            <div className="h-8 w-8 rounded-full flex justify-center items-center text-white" />{" "}
          </div>
          <div>
            <span className=" font-extrabold">3</span>
            <span className="text-sm text-gray-600"> Pending</span>
          </div>
        </div>
        <div className="flex flex-col justify-center items-center">
          <div className="h-8 w-8 rounded-full flex justify-center items-center text-white" />{" "}
        </div>
        <div>
          <span className=" font-extrabold">1</span>
          <span className="text-sm text-gray-600"> Cancelled</span>
        </div>
      </div>
    </>
  );
}
