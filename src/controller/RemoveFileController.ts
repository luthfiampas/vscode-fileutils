import * as path from 'path';
import { window } from 'vscode';
import { FileItem } from '../Item';
import { AbstractFileController, ExecuteOptions } from './AbstractFileController';

export class RemoveFileController extends AbstractFileController {

    public async showDialog(): Promise<FileItem> {
        const sourcePath = this.sourcePath;

        if (!sourcePath) {
            throw new Error();
        }

        if (!this.confirmDelete) {
            return new FileItem(sourcePath);
        }

        const message = `Are you sure you want to delete '${path.basename(sourcePath)}'?`;
        const action = this.useTrash ? 'Move to Trash' : 'Delete';
        const remove = await window.showInformationMessage(message, { modal: true }, action);
        if (remove) {
            return new FileItem(sourcePath);
        }
    }

    public async execute(options: ExecuteOptions): Promise<FileItem> {
        const { fileItem } = options;
        try {
            await fileItem.remove(this.useTrash);
        } catch (e) {
            throw new Error(`Error deleting file '${fileItem.path}'.`);
        }
        return fileItem;
    }

    private get useTrash(): boolean {
        return this.configuration.get('delete.useTrash');
    }

    private get confirmDelete(): boolean {
        return this.configuration.get('delete.confirm');
    }
}
