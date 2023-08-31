import { Card, Table } from '@nextui-org/react';
import { BiSolidFileJson } from 'react-icons/bi';

export default function HistoryLoading() {
  return (
    <Table
      lined
      selectionMode="single"
      color="primary"
      containerCss={{
        width: '70%',
        minWidth: 'fit-content',
      }}
      css={{
        height: 'auto',
        width: '100%',
      }}
    >
      <Table.Header>
        <Table.Column css={{ fontWeight: 'bold', fontSize: '$sm' }} align="center">
          科目
        </Table.Column>
        <Table.Column css={{ fontWeight: 'bold', fontSize: '$sm' }} align="center">
          得分
        </Table.Column>
        <Table.Column css={{ fontWeight: 'bold', fontSize: '$sm' }} align="center">
          Date
        </Table.Column>
      </Table.Header>
      <Table.Body>
        {Array.from({ length: 8 }, (_, i) => i + 1).map((index) => (
          <Table.Row key={index}>
            <Table.Cell>
              <div className="w-full h-6 flex justify-center ">
                <div className="w-24 h-full bg-slate-200"></div>
              </div>
            </Table.Cell>
            <Table.Cell>
              <div className="w-full h-6 flex justify-center ">
                <div className="w-4 h-full bg-slate-200"></div>
              </div>
            </Table.Cell>
            <Table.Cell>
              <div className="w-full h-6 flex justify-center ">
                <div className="w-36 h-full bg-slate-200"></div>
              </div>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
      <Table.Pagination
        css={{ fontSize: '$md' }}
        shadow
        noMargin
        align="center"
        rowsPerPage={8}
        total={1}
      />
    </Table>
  );
}
