'use client'
import { Button, FloatingIndicator, Tabs, TextInput } from '@mantine/core';
import { useState, useCallback } from 'react';
import { Notifications, showNotification } from '@mantine/notifications';
import SearchBar from '../SearchBar';
import { Epilogue } from 'next/font/google';
import classes from '../css/tabs.module.css';
import BrandSelect from '../BrandsSelect';
import AddItem from './AddItem';
import EditItems from './EditItems';
import DeleteItems from './DeleteItems';
import React from 'react';
import styles from "../css/inputfield.module.css";

const epilogue = Epilogue({
    subsets: ['latin'],
    display: 'swap',
})

export default function AdminStock() {
    const [rootRef, setRootRef] = useState<HTMLDivElement | null>(null);
    const [searchValue, setSearchValue] = useState<string>('');
    const [value, setValue] = useState<string | null>('1');
    const [controlsRefs, setControlsRefs] = useState<Record<string, HTMLButtonElement | null>>({});

    const AddItemMemoized = React.memo(AddItem);
    const DeleteItemsMemoized = React.memo(DeleteItems);


    console.log('rendering');
    const setControlRef = (val: string) => (node: HTMLButtonElement) => {
        controlsRefs[val] = node;
        setControlsRefs(controlsRefs);
    };

    const handleSearchChange = useCallback((newSearchValue: string) => {
        setSearchValue(newSearchValue);
    }, []);

    const handleNotification = () => {
        showNotification({
            title: 'Successfully submitted!',
            message: 'The products have been successfully submitted.',
        });
    };

    return (
        <div className="relative z-50 mb-[18rem] bg-white overflow-hidden flex flex-col items-center justify-items-center min-h-screen p-8 pb-20 sm:p-20">
            <div className='flex flex-row items-center justify-end w-full'>
                {(value == "2" || value == "3") && 
                    <div className="flex flex-row">
                    <TextInput
                        classNames={{
                            wrapper: styles.inputWrapper,
                            input: styles.input,
                        }}
                        className="mx-4"
                        value={searchValue}
                        onChange={(event) => handleSearchChange(event.currentTarget.value)}
                        placeholder="Search"
                    />
                </div>
                }
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
                <AddItemMemoized onSuccess={handleNotification} />
            }

            {value === "2" &&
                <EditItems searchValue={searchValue} onSuccess={handleNotification} />
            }

            {value === "3" &&
                <DeleteItemsMemoized searchValue={searchValue} onSuccess={handleNotification} />
            }

            <Notifications />
        </div>
    );
}
