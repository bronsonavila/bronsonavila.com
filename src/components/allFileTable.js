import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';

const AllFileTable = () => {
  const data = useStaticQuery(graphql`
    query {
      allFile {
        edges {
          node {
            id
            base
            accessTime
            size
            name
          }
        }
      }
    }
  `);

  return (
    <div className="my-8">
      <div className="flex border-b border-gray-900 py-1">
        <div className="font-bold flex-1 p-1">id</div>
        <div className="font-bold flex-1 p-1">base</div>
        <div className="font-bold flex-1 p-1">accessTime</div>
        <div className="font-bold flex-1 p-1">size</div>
        <div className="font-bold flex-1 p-1">name</div>
      </div>
      <div className="flex flex-col">
        {data.allFile.edges.map(({ node }, index) => (
          <div className="flex border-b border-gray-500 py-1" key={index}>
            <div className="flex-1 p-1">{node.id}</div>
            <div className="flex-1 p-1">{node.base}</div>
            <div className="flex-1 p-1">{node.accessTime}</div>
            <div className="flex-1 p-1">{node.size}</div>
            <div className="flex-1 p-1">{node.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllFileTable;
