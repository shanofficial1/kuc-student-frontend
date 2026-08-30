import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function ConfirmDelete({
  open,
  setOpen,
  onConfirm,
}) {
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="rounded-2xl">

        <AlertDialogHeader>

          <AlertDialogTitle className="text-red-600">
            Delete Record?
          </AlertDialogTitle>

          <AlertDialogDescription>
            This action cannot be undone.
          </AlertDialogDescription>

        </AlertDialogHeader>

        <AlertDialogFooter>

          <AlertDialogCancel>
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700"
          >
            Delete
          </AlertDialogAction>

        </AlertDialogFooter>

      </AlertDialogContent>
    </AlertDialog>
  );
}