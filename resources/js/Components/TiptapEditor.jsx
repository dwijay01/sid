import React, { Fragment } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import { TextAlign } from '@tiptap/extension-text-align';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDown, Bold, Italic, Strikethrough, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, AlignJustify, Table as TableIcon } from 'lucide-react';

const MenuBar = ({ editor }) => {
    if (!editor) {
        return null;
    }

    const variables = [
        { label: 'Nama Warga', value: '{{nama}}' },
        { label: 'NIK', value: '{{nik}}' },
        { label: 'Tempat, Tgl Lahir', value: '{{tempat_lahir}}, {{tanggal_lahir}}' },
        { label: 'Tempat Lahir', value: '{{tempat_lahir}}' },
        { label: 'Tanggal Lahir', value: '{{tanggal_lahir}}' },
        { label: 'Jenis Kelamin', value: '{{jenis_kelamin}}' },
        { label: 'Pekerjaan', value: '{{pekerjaan}}' },
        { label: 'Agama', value: '{{agama}}' },
        { label: 'Alamat', value: '{{alamat}}' },
        { label: 'Keperluan', value: '{{keperluan}}' },
        { label: 'Nomor Surat', value: '{{nomor_surat}}' },
        { label: 'Tanggal Saat Ini', value: '{{tanggal}}' },
        { label: 'Nama Kades', value: '{{nama_kades}}' },
        { label: 'Nama Desa', value: '{{nama_desa}}' },
        { label: 'Kecamatan', value: '{{kecamatan}}' },
        { label: 'Kabupaten', value: '{{kabupaten}}' },
        { label: 'Provinsi', value: '{{provinsi}}' },
    ];

    const insertVariable = (value) => {
        editor.chain().focus().insertContent(value).run();
    };

    return (
        <div className="flex flex-wrap items-center gap-1 p-2 border-b border-slate-200 bg-slate-50 rounded-t-xl z-20 sticky top-0">
            {/* Formatting Tools */}
            <div className="flex items-center gap-0.5 mr-4 border-r border-slate-200 pr-4">
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`p-2 rounded hover:bg-slate-200 transition-colors ${editor.isActive('bold') ? 'bg-slate-200 text-slate-900' : 'text-slate-600'}`}
                    title="Bold"
                >
                    <Bold size={16} />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`p-2 rounded hover:bg-slate-200 transition-colors ${editor.isActive('italic') ? 'bg-slate-200 text-slate-900' : 'text-slate-600'}`}
                    title="Italic"
                >
                    <Italic size={16} />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    className={`p-2 rounded hover:bg-slate-200 transition-colors ${editor.isActive('strike') ? 'bg-slate-200 text-slate-900' : 'text-slate-600'}`}
                    title="Strikethrough"
                >
                    <Strikethrough size={16} />
                </button>
            </div>

            {/* Lists */}
            <div className="flex items-center gap-0.5 mr-4 border-r border-slate-200 pr-4">
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={`p-2 rounded hover:bg-slate-200 transition-colors ${editor.isActive('bulletList') ? 'bg-slate-200 text-slate-900' : 'text-slate-600'}`}
                    title="Bullet List"
                >
                    <List size={16} />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={`p-2 rounded hover:bg-slate-200 transition-colors ${editor.isActive('orderedList') ? 'bg-slate-200 text-slate-900' : 'text-slate-600'}`}
                    title="Numbered List"
                >
                    <ListOrdered size={16} />
                </button>
            </div>

            {/* Alignment */}
            <div className="flex items-center gap-0.5 mr-4 border-r border-slate-200 pr-4">
                <button
                    type="button"
                    onClick={() => editor.chain().focus().setTextAlign('left').run()}
                    className={`p-2 rounded hover:bg-slate-200 transition-colors ${editor.isActive({ textAlign: 'left' }) ? 'bg-slate-200 text-slate-900' : 'text-slate-600'}`}
                    title="Align Left"
                >
                    <AlignLeft size={16} />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().setTextAlign('center').run()}
                    className={`p-2 rounded hover:bg-slate-200 transition-colors ${editor.isActive({ textAlign: 'center' }) ? 'bg-slate-200 text-slate-900' : 'text-slate-600'}`}
                    title="Align Center"
                >
                    <AlignCenter size={16} />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().setTextAlign('right').run()}
                    className={`p-2 rounded hover:bg-slate-200 transition-colors ${editor.isActive({ textAlign: 'right' }) ? 'bg-slate-200 text-slate-900' : 'text-slate-600'}`}
                    title="Align Right"
                >
                    <AlignRight size={16} />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                    className={`p-2 rounded hover:bg-slate-200 transition-colors ${editor.isActive({ textAlign: 'justify' }) ? 'bg-slate-200 text-slate-900' : 'text-slate-600'}`}
                    title="Justify"
                >
                    <AlignJustify size={16} />
                </button>
            </div>

            {/* Table Tools */}
            <Menu as="div" className="relative mr-4 border-r border-slate-200 pr-4">
                <Menu.Button className="flex items-center gap-2 p-2 rounded hover:bg-slate-200 transition-colors text-slate-600 text-sm font-medium">
                    <TableIcon size={16} /> Tabel <ChevronDown size={14} />
                </Menu.Button>
                <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                >
                    <Menu.Items className="absolute z-50 left-0 mt-1 w-48 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none py-1 text-sm">
                        <Menu.Item>
                            {({ active }) => (
                                <button type="button" onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: false }).run()} className={`${active ? 'bg-slate-100 text-slate-900' : 'text-slate-700'} group flex w-full items-center px-4 py-2`}>
                                    Sisipkan Tabel
                                </button>
                            )}
                        </Menu.Item>
                        <Menu.Item>
                            {({ active }) => (
                                <button type="button" onClick={() => editor.chain().focus().addColumnAfter().run()} disabled={!editor.can().addColumnAfter()} className={`${active ? 'bg-slate-100 text-slate-900' : 'text-slate-700'} group flex w-full items-center px-4 py-2 disabled:opacity-50`}>
                                    Tambah Kolom
                                </button>
                            )}
                        </Menu.Item>
                        <Menu.Item>
                            {({ active }) => (
                                <button type="button" onClick={() => editor.chain().focus().addRowAfter().run()} disabled={!editor.can().addRowAfter()} className={`${active ? 'bg-slate-100 text-slate-900' : 'text-slate-700'} group flex w-full items-center px-4 py-2 disabled:opacity-50`}>
                                    Tambah Baris
                                </button>
                            )}
                        </Menu.Item>
                        <Menu.Item>
                            {({ active }) => (
                                <button type="button" onClick={() => editor.chain().focus().deleteTable().run()} disabled={!editor.can().deleteTable()} className={`${active ? 'bg-red-50 text-red-700' : 'text-red-600'} group flex w-full items-center px-4 py-2 disabled:opacity-50 mt-1 border-t border-slate-100`}>
                                    Hapus Tabel
                                </button>
                            )}
                        </Menu.Item>
                    </Menu.Items>
                </Transition>
            </Menu>

            {/* Variable Insertion Dropdown */}
            <Menu as="div" className="relative ml-auto">
                <Menu.Button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-800 hover:bg-emerald-200 transition-colors text-sm font-bold shadow-sm">
                    Buat Variabel <ChevronDown size={14} />
                </Menu.Button>
                <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                >
                    <Menu.Items className="absolute z-50 right-0 mt-2 w-56 origin-top-right rounded-md bg-white shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none py-2 h-[300px] overflow-y-auto">
                        <div className="px-3 pb-2 mb-2 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            Data Pemohon
                        </div>
                        {variables.map((v, i) => (
                            <Menu.Item key={i}>
                                {({ active }) => (
                                    <button
                                        type="button"
                                        onClick={() => insertVariable(v.value)}
                                        className={`${active ? 'bg-emerald-50 text-emerald-900' : 'text-slate-700'} group flex w-full items-center px-4 py-2 text-sm justify-between transition-colors`}
                                    >
                                        <span>{v.label}</span>
                                        <span className="text-xs text-slate-400 font-mono">{v.value}</span>
                                    </button>
                                )}
                            </Menu.Item>
                        ))}
                    </Menu.Items>
                </Transition>
            </Menu>
        </div>
    );
};

export default function TiptapEditor({ value, onChange, disabled = false }) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Table.configure({
                resizable: true,
                HTMLAttributes: {
                    class: 'w-full border-collapse border border-slate-300 my-4 table-auto',
                },
            }),
            TableRow,
            TableHeader.configure({
                HTMLAttributes: {
                    class: 'border border-slate-300 bg-slate-100 p-2 font-bold text-left',
                },
            }),
            TableCell.configure({
                HTMLAttributes: {
                    class: 'border border-slate-300 p-2',
                },
            }),
        ],
        content: value,
        editable: !disabled,
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            onChange(html);
        },
        editorProps: {
            attributes: {
                class: 'p-4 min-h-[500px] max-h-[800px] overflow-y-auto prose max-w-none focus:outline-none bg-white rounded-b-xl',
            },
        },
    });

    return (
        <div className={`border rounded-xl shadow-sm ${disabled ? 'opacity-80 bg-slate-50 pointer-events-none' : 'border-slate-300 bg-white'}`}>
            <MenuBar editor={editor} />
            <div className="relative">
                <EditorContent editor={editor} />
            </div>
            
            {/* Some minimal CSS overrides globally for this component scope so Tailwind Prose doesn't mangle tables or alignment too badly without actual Tailwind Typography plugin */}
            <style jsx global>{`
                .ProseMirror p {
                    margin-bottom: 0.5em;
                }
                .ProseMirror table {
                    border-collapse: collapse;
                    margin: 0;
                    overflow: hidden;
                    table-layout: fixed;
                    width: 100%;
                }
                .ProseMirror table td, .ProseMirror table th {
                    border: 1px solid #cbd5e1; /* slate-300 */
                    box-sizing: border-box;
                    min-width: 1em;
                    padding: 8px;
                    position: relative;
                    vertical-align: top;
                }
                .ProseMirror table th {
                    background-color: #f1f5f9; /* slate-100 */
                    font-weight: bold;
                    text-align: left;
                }
                .ProseMirror .selectedCell:after {
                    background: rgba(200, 200, 255, 0.4);
                    content: "";
                    left: 0; right: 0; top: 0; bottom: 0;
                    pointer-events: none;
                    position: absolute;
                    z-index: 2;
                }
                .ProseMirror .column-resize-handle {
                    background-color: #059669;
                    bottom: -2px;
                    pointer-events: none;
                    position: absolute;
                    right: -2px;
                    top: 0;
                    width: 4px;
                }
                .ProseMirror p.is-editor-empty:first-child::before {
                    color: #94a3b8;
                    content: attr(data-placeholder);
                    float: left;
                    height: 0;
                    pointer-events: none;
                }
            `}</style>
        </div>
    );
}
