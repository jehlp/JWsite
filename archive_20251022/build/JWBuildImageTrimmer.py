from pathlib import Path
from PIL import Image

def is_uniform_row(image, row_index, tolerance=0):
    image_width = image.width
    row_pixel_colors = [image.getpixel((x_pos, row_index)) for x_pos in range(image_width)]
    return all(
        all(abs(row_pixel_colors[0][color_channel] - pixel[color_channel]) <= tolerance
            for color_channel in range(len(pixel)))
        for pixel in row_pixel_colors[1:]
    )

def is_uniform_column(image, column_index, tolerance=0):
    image_height = image.height
    column_pixel_colors = [image.getpixel((column_index, y_pos)) for y_pos in range(image_height)]
    return all(
        all(abs(column_pixel_colors[0][color_channel] - pixel[color_channel]) <= tolerance
            for color_channel in range(len(pixel)))
        for pixel in column_pixel_colors[1:]
    )

def trim_uniform_margins(image, tolerance=0):
    image_width, image_height = image.width, image.height
    top_margin = 0
    while top_margin < image_height - 1 and is_uniform_row(image, top_margin, tolerance):
        top_margin += 1
    bottom_margin = image_height - 1
    while bottom_margin > top_margin and is_uniform_row(image, bottom_margin, tolerance):
        bottom_margin -= 1
    left_margin = 0
    while left_margin < image_width - 1 and is_uniform_column(image, left_margin, tolerance):
        left_margin += 1
    right_margin = image_width - 1
    while right_margin > left_margin and is_uniform_column(image, right_margin, tolerance):
        right_margin -= 1
    return image.crop((left_margin, top_margin, right_margin + 1, bottom_margin + 1))

def trim_images():
    images_directory = Path(__file__).parent.parent / 'assets' / 'images'
    supported_extensions = {'.png', '.jpg', '.jpeg', '.gif', '.bmp', '.tiff'}
    for image_path in images_directory.glob('*'):
        if image_path.suffix.lower() in supported_extensions:
            try:
                with Image.open(image_path) as original_image:
                    modified_image = original_image.copy()
                    trimmed_image = trim_uniform_margins(modified_image)
                    if trimmed_image.width != original_image.width or trimmed_image.height != original_image.height:
                        print(f"Trimming {image_path.name}: {original_image.width}x{original_image.height} -> {trimmed_image.width}x{trimmed_image.height}")
                        trimmed_image.save(image_path)
            except Exception as exception:
                print(f"Error processing {image_path.name}: {exception}")

if __name__ == '__main__':
    trim_images()