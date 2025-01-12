import React from 'react';
import TreeView from 'react-treeview';
import 'react-treeview/react-treeview.css';

const data = [
    {
        label: 'Parent 1',
        children: ['Child 1.1', 'Child 1.2'],
    },
    {
        label: 'Parent 2',
        children: ['Child 2.1', 'Child 2.2'],
    },
];

function App() {
    return (
        <div>
            {data.map((node, i) => (
                <TreeView key={i} nodeLabel={node.label} defaultCollapsed={true}>
                    {node.children.map((child, j) => (
                        <div key={j}>{child}</div>
                    ))}
                </TreeView>
            ))}
        </div>
    );
}

export default App;
