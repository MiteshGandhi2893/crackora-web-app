"use client"

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
} from "@mui/material";

type MessageModalProps = {
  onClose: () => void;
  message: string;
  type?: "success" | "error" | "info" | "warning";
  title?: string;
  callback?: () => void; // <-- add this
};

export const MessageModal = ({
  onClose,
  message,
  type = "info",
  title,
  callback,
}: MessageModalProps) => {
  const handleClose = () => {
    onClose();
    if (callback) callback(); // <-- call the callback after closing
  };

  return (
    <Dialog open onClose={handleClose}>
      {title && <DialogTitle>{title}</DialogTitle>}
      <DialogContent>
        <Alert severity={type}>{message}</Alert>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleClose}
          className="bg-cyan-900 text-white"
          variant="contained"
        >
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};
