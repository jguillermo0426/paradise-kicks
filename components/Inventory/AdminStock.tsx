'use client'
import { FloatingIndicator, Tabs } from '@mantine/core';
import { useState } from 'react';
import { Notifications, showNotification } from '@mantine/notifications';
import SearchBar from '../SearchBar';
import { Epilogue } from 'next/font/google';
import classes from '../css/tabs.module.css';
import BrandSelect from '../BrandsSelect';
import AddItem from './AddItem';
import EditItems from './EditItems';
import DeleteItems from './DeleteItems';

const epilogue = Epilogue({
    subsets: ['latin'],
    display: 'swap',
})


export default function AdminStock() {
    const [rootRef, setRootRef] = useState<HTMLDivElement | null>(null);

    const [value, setValue] = useState<string | null>('1');
    const [controlsRefs, setControlsRefs] = useState<Record<string, HTMLButtonElement | null>>({});
    const setControlRef = (val: string) => (node: HTMLButtonElement) => {
        controlsRefs[val] = node;
        setControlsRefs(controlsRefs);
    };

    const handleNotification = () => {
        showNotification({
            title: 'Successfully submitted!',
            message: 'The products have been successfully submitted.',
        });
    };

    return (
        <div className="relative z-50 mb-[18rem] bg-white overflow-hidden flex flex-col items-center justify-items-center min-h-screen p-8 pb-20 sm:p-20">
            <div className='flex flex-row items-center justify-end w-full'>
                <SearchBar />
            </div>

            <div className='flex flex-row items-center justify-between w-full'>

                {value == "1" && <p style={epilogue.style} className="text-[72px] font-bold">Add Item</p>}
                {value == "2" && <p style={epilogue.style} className="text-[72px] font-bold">Edit Inventory</p>}
                {value == "3" && <p style={epilogue.style} className="text-[72px] font-bold">Delete Item</p>}

                <div className='flex flex-row items-center justify-center w-[42rem] h-[6rem] rounded-xl bg-[#38bdba] pt-[1rem] -mr-[6rem] mt-[5rem]'>

                    <Tabs variant="none" value={value} onChange={setValue}>
                        <Tabs.List ref={setRootRef} className={classes.list}>
                            <Tabs.Tab style={epilogue.style} value="1" ref={setControlRef('1')} className={classes.tab}>
                                Add
                            </Tabs.Tab>
                            <Tabs.Tab style={epilogue.style} value="2" ref={setControlRef('2')} className={classes.tab}>
                                Edit
                            </Tabs.Tab>
                            <Tabs.Tab style={epilogue.style} value="3" ref={setControlRef('3')} className={classes.tab}>
                                Delete
                            </Tabs.Tab>

                            <FloatingIndicator
                                target={value ? controlsRefs[value] : null}
                                parent={rootRef}
                                className={classes.indicator}
                            />
                        </Tabs.List>
                    </Tabs>

                </div>
            </div>

            {value == "1" &&
                <AddItem onSuccess={handleNotification} />
            }

            {value === "2" &&
                <>
                    <BrandSelect />
                    <EditItems onSuccess={handleNotification} />
                </>
            }

            {value === "3" &&
                <>
                    <BrandSelect />
                    <DeleteItems onSuccess={handleNotification} />
                </>
            }

            <Notifications></Notifications>

        </div>
    );
}
