import { Box, FileUpload, Icon, SystemStyleObject } from "@chakra-ui/react"
import { LuImage } from "react-icons/lu"

const style: SystemStyleObject = {
    _disabled: {
        cursor: "disabled",
        color: "fg.subtle"
    },

    "& .muted": {
        color: "fg.muted",
    },

    "&[data-disabled] .muted": {
        color: "fg.subtle"
    }
}

type ImageUploadProps = {
    maxSize: number
    file: File | null
    onFileAccept: (file: File) => void
}
export const ImageUpload = ({ maxSize, file, onFileAccept }: ImageUploadProps) => {
    return <FileUpload.Root css={style} alignItems="stretch" maxFileSize={maxSize * 1024 * 1024} accept={["image/*"]} onFileAccept={(details) => onFileAccept(details.files[0])}>
        <FileUpload.HiddenInput />
        <FileUpload.Dropzone>
            <Icon size="md" className="muted"><LuImage /></Icon>
            <FileUpload.DropzoneContent>
                {file ?
                    <FileUpload.FileText /> :
                    <>
                        <div>Перетащите изображение сюда</div>
                        <div className="muted">Размер до {maxSize} мб</div>
                    </>
                }
            </FileUpload.DropzoneContent>
        </FileUpload.Dropzone>
    </FileUpload.Root>
}