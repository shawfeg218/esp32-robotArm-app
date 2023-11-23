import { Card } from "@nextui-org/react";
import Link from "next/link";
import React from "react";
import { BsArrowRightShort } from "react-icons/bs";

export default function HomeCard(props) {
  const { img, title, description, link, width } = props;
  return (
    <Card aria-label="Home card" isHoverable className="w-fit">
      <div className="w-96 bg-white border border-gray-200 rounded-lg shadow">
        <div className="overflow-hidden h-60 w-full flex justify-center items-center">
          <div>
            <img className="rounded-t-lg" src={img} style={{ width: width }} />
          </div>
        </div>
        <div className="p-5">
          <h1 className="mb-2 tracking-tight text-gray-900">{title}</h1>
          <p>{description}</p>
          <Link href={link} passHref>
            <button className="w-fit inline-flex justify-center items-center border-0 px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800">
              Get start
              <BsArrowRightShort size={24} />
            </button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
