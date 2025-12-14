<?php

declare(strict_types=1);

namespace App\Services;

class FileService
{
    private string $basePath;
    private int $maxSize;

    public function __construct(string $baseUploadDir, int $maxUploadSize)
    {
        $root = dirname(__DIR__, 2);
        $this->basePath = $this->resolveBasePath($root, $baseUploadDir);
        $this->maxSize = $maxUploadSize;

        if (!is_dir($this->basePath)) {
            mkdir($this->basePath, 0775, true);
        }
    }

    public function savePaymentProof(array $file, int $paymentId): string
    {
        if (!isset($file['tmp_name']) || (int) ($file['error'] ?? UPLOAD_ERR_OK) !== UPLOAD_ERR_OK) {
            throw new \RuntimeException('No file uploaded or upload failed.');
        }

        if (($file['size'] ?? 0) > $this->maxSize) {
            throw new \RuntimeException('File exceeds MAX_UPLOAD_SIZE.');
        }

        $extension = pathinfo($file['name'] ?? 'proof', PATHINFO_EXTENSION) ?: 'bin';
        $targetDir = $this->basePath . DIRECTORY_SEPARATOR . $paymentId;

        if (!is_dir($targetDir)) {
            mkdir($targetDir, 0775, true);
        }

        $targetName = uniqid('proof_', true) . '.' . $extension;
        $targetPath = $targetDir . DIRECTORY_SEPARATOR . $targetName;

        if (!move_uploaded_file($file['tmp_name'], $targetPath)) {
            throw new \RuntimeException('Unable to store uploaded file.');
        }

        return str_replace(dirname(__DIR__, 2) . DIRECTORY_SEPARATOR, '', $targetPath);
    }

    private function resolveBasePath(string $root, string $path): string
    {
        $trimmed = trim($path);
        if ($trimmed === '') {
            return $root . DIRECTORY_SEPARATOR . 'public' . DIRECTORY_SEPARATOR . 'uploads';
        }

        $isAbsolute = str_starts_with($trimmed, DIRECTORY_SEPARATOR) || preg_match('/^[A-Za-z]:\\\\/', $trimmed) === 1;
        if ($isAbsolute) {
            return rtrim($trimmed, DIRECTORY_SEPARATOR);
        }

        return rtrim($root . DIRECTORY_SEPARATOR . str_replace(['/', '\\'], DIRECTORY_SEPARATOR, $trimmed), DIRECTORY_SEPARATOR);
    }
}
