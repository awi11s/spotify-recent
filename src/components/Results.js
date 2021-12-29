import React from "react";


function Results({ results }) {


    return (
        <div className="w-3/4 space-y-6 text-center">
        {results.items ?
            results.items.map((item, idx) => (
            <div
                key={idx}
                style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${
                    item.images ? item.images[0].url : item.album.images[0].url
                })`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                height: "300px",
                }}
                className="p-6 m-1 rounded-xl shadow-xl text-center bg-center hover:scale-105"
            >
            <h1 
                key={item.name} 
                className="font-asap text-3xl text-green-200"
            >
                {idx + 1}. {item.name}
            </h1>
                {item.followers ?
                    <div className="pt-6">
                    <p className="font-asap text-sm text-left text-green-200">following: {item.followers.total}</p>
                    <ul className="">
                        {item.genres.map((genre, idx) => (
                            <li key={idx} className=" text-right font-asap text-sm text-green-200">{genre}</li>
                        ))}
                    </ul>
                    </div>
                    :
                    <p className="font-asap text-xl text-green-200">popularity: {item.popularity}</p>
                }
            </div>
            ))
            :
            <h1 className="font-asap text-3xl">click to get results</h1>
            }
        </div>
    );
}

export default Results;
