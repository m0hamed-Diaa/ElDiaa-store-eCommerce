interface UploadedFile {
    id: number;
    documentId: string;
    url: string;
}

type UploadFilesFn = (
    files: File[]
) => {
    unwrap: () => Promise<UploadedFile[]>;
};

export const uploadSingleImage = async (
    file: File,
    uploadFiles: UploadFilesFn
): Promise<number> => {
    const uploaded = await uploadFiles([
        file,
    ]).unwrap();

    return uploaded[0].id;
};

export const uploadMultiImages = async (
    files: File[],
    uploadFiles: UploadFilesFn
): Promise<number[]> => {
    const uploaded = await uploadFiles(
        files
    ).unwrap();

    return uploaded.map(
        (file) => file.id
    );
};